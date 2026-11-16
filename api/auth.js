import { randomBytes } from "node:crypto";
import { cookieName, findAccountSession, findSessionUser, hashToken, sessionId } from "../server/sessions.js";
import express from "express";
import { ObjectId } from "mongodb";
import { ensureUserEmails } from "../server/user-emails.js";
import { releaseLoginAttempt, reserveLoginAttempt } from "../server/login-attempts.js";
import {
  sessionsCollection as sessions,
  usersCollection as users,
} from "../server/database.js";
import {
  hashPassword,
  needsPasswordUpgrade,
  verifyPassword,
} from "../server/passwords.js";

const app = express();
app.disable("x-powered-by");

const duration = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
  path: "/api",
};

const legacyCookieOptions = { ...cookieOptions, path: "/api/auth" };

function publicUser(user) {
  return { email: user.email ?? user._id, name: user.name, role: user.role };
}

async function currentUser(req, res) {
  const account = await findAccountSession(req);
  if (!account) return res.json({ user: null });

  res.clearCookie(cookieName, legacyCookieOptions);
  res.cookie(cookieName, account.token, { ...cookieOptions, expires: account.expiresAt });
  res.json({ user: publicUser(account.user) });
}

function parseDisplayName(value) {
  const name = typeof value === "string" ? value.trim() : "";
  return name.length >= 3 && name.length <= 80 ? name : null;
}

function invalidName(res) {
  return res.status(400).json({ error: "نام باید بین ۳ تا ۸۰ کاراکتر باشد." });
}

function parseEmail(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function validPassword(value) {
  return typeof value === "string" && value.length >= 8 && value.length <= 128;
}

async function updateProfile(req, res) {
  const user = await findSessionUser(req);
  if (!user) return res.status(401).json({ error: "برای ویرایش حساب دوباره وارد شو." });
  const body = req.body;
  const allowedFields = ["name", "email", "currentPassword", "newPassword", "confirmPassword"];
  if (!body || Array.isArray(body) || Object.keys(body).some((key) => !allowedFields.includes(key))) {
    return res.status(400).json({ error: "اطلاعات حساب معتبر نیست." });
  }

  const name = parseDisplayName(body.name);
  if (!name) return invalidName(res);

  const email = parseEmail(Object.hasOwn(body, "email") ? body.email : publicUser(user).email);
  if (!email) return res.status(400).json({ error: "ایمیل معتبر نیست." });

  const { currentPassword = "", newPassword = "", confirmPassword = "" } = body;
  const changes = { name };
  if (Object.hasOwn(body, "email")) changes.email = email;
  const filter = { _id: user._id };
  if (newPassword !== "" || confirmPassword !== "") {
    if (!validPassword(newPassword) || newPassword !== confirmPassword) {
      return res.status(400).json({ error: "رمز جدید باید ۸ تا ۱۲۸ کاراکتر باشد و با تکرار آن مطابقت داشته باشد." });
    }
    if (!validPassword(currentPassword)) {
      return res.status(400).json({ error: "رمز عبور فعلی را وارد کن." });
    }
    const attempt = await reserveLoginAttempt(publicUser(user).email);
    if (!attempt.allowed) {
      await releaseLoginAttempt(attempt.id);
      return res.set("Retry-After", String(attempt.retryAfter)).status(429).json({
        error: "تعداد تلاش‌ها زیاد است. کمی بعد دوباره تلاش کن.",
      });
    }
    if (!await verifyPassword(currentPassword, user.credentials)) {
      return res.status(403).json({ error: "رمز عبور فعلی اشتباه است." });
    }
    await releaseLoginAttempt(attempt.id);
    changes.credentials = await hashPassword(newPassword);
    filter["credentials.hash"] = user.credentials.hash;
  }

  await ensureUserEmails();
  let updated;
  try {
    const update = { $set: changes };
    if (changes.credentials) update.$inc = { sessionVersion: 1 };
    updated = await users.findOneAndUpdate(filter, update, { returnDocument: "after" });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "این ایمیل قبلاً ثبت شده است." });
    throw error;
  }
  if (!updated) return res.status(409).json({ error: "اطلاعات حساب تغییر کرده است. دوباره تلاش کن." });
  if (changes.credentials) return establishSession(req, res, updated, 200);
  res.json({ user: publicUser(updated) });
}

async function establishSession(req, res, user, status) {
  const token = randomBytes(32).toString("hex");
  await sessions.insertOne({
    _id: hashToken(token),
    userId: user._id,
    version: user.sessionVersion ?? 0,
    expiresAt: new Date(Date.now() + duration),
  });
  const previous = sessionId(req);
  if (previous) await sessions.deleteOne({ _id: previous });
  res.clearCookie(cookieName, legacyCookieOptions);
  res.cookie(cookieName, token, { ...cookieOptions, maxAge: duration });
  res.status(status).json({ user: publicUser(user) });
}

async function authenticate(req, res) {
  const { action, email, password, name } = req.body ?? {};
  const address = parseEmail(email);
  if (!["register", "login"].includes(action) || !address || !validPassword(password)) {
    return res.status(400).json({ error: "ایمیل یا رمز عبور معتبر نیست." });
  }
  await ensureUserEmails();

  if (action === "login") {
    const attempt = await reserveLoginAttempt(address);
    if (!attempt.allowed) {
      await releaseLoginAttempt(attempt.id);
      return res.set("Retry-After", String(attempt.retryAfter)).status(429).json({
        error: "تعداد تلاش‌های ورود زیاد است. کمی بعد دوباره تلاش کنید.",
      });
    }

    const user = await users.findOne({ email: address });
    if (!(await verifyPassword(password, user?.credentials))) {
      return res.status(401).json({ error: "ایمیل یا رمز عبور اشتباه است." });
    }
    await releaseLoginAttempt(attempt.id);
    if (needsPasswordUpgrade(user.credentials)) {
      const credentials = await hashPassword(password);
      await users.updateOne(
        { _id: user._id, "credentials.hash": user.credentials.hash },
        { $set: { credentials } },
      );
    }
    return establishSession(req, res, user, 200);
  }

  const displayName = parseDisplayName(name);
  if (!displayName) return invalidName(res);

  const user = {
    _id: new ObjectId().toHexString(),
    email: address,
    name: displayName,
    role: "user",
    credentials: await hashPassword(password),
    createdAt: new Date(),
  };
  try {
    await users.insertOne(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "این ایمیل قبلاً ثبت شده است." });
    }
    throw error;
  }
  return establishSession(req, res, user, 201);
}

async function logout(req, res) {
  const id = sessionId(req);
  if (id) await sessions.deleteOne({ _id: id });
  res.clearCookie(cookieName, legacyCookieOptions);
  res.clearCookie(cookieName, cookieOptions).status(204).end();
}

app.use("/api/auth", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const readJson = express.json({ limit: "4kb" });

app
  .route("/api/auth")
  .get(currentUser)
  .post(readJson, authenticate)
  .patch(readJson, updateProfile)
  .delete(logout);

app.use((error, _req, res, _next) => {
  if (error.status === 400 || error.status === 413) {
    return res.status(error.status).json({ error: "درخواست نامعتبر است." });
  }
  console.error(error.name);
  res.status(500).json({ error: "درخواست انجام نشد. دوباره تلاش کنید." });
});

export default app;
