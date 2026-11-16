import { createHash, randomBytes } from "node:crypto";
import express from "express";
import { sessionsCollection as sessions, usersCollection as users } from "../server/database.js";
import { hashPassword, needsPasswordUpgrade, verifyPassword } from "../server/passwords.js";

const app = express();
app.disable("x-powered-by");

const cookieName = "ecohome_session";
const duration = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
  path: "/api/auth",
};

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function sessionId(req) {
  const cookies = (req.get("Cookie") ?? "").split(";").map((cookie) => cookie.trim());
  const token = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  return token && /^[0-9a-f]{64}$/.test(token) ? hashToken(token) : null;
}

function publicUser(user) {
  return { email: user._id, name: user.name, role: user.role };
}

async function currentUser(req, res) {
  const id = sessionId(req);
  const session = id && await sessions.findOne({ _id: id, expiresAt: { $gt: new Date() } });
  const user = session && await users.findOne({ _id: session.userId });
  res.json({ user: user ? publicUser(user) : null });
}

async function establishSession(req, res, user, status) {
  const token = randomBytes(32).toString("hex");
  await sessions.insertOne({
    _id: hashToken(token),
    userId: user._id,
    expiresAt: new Date(Date.now() + duration),
  });
  const previous = sessionId(req);
  if (previous) await sessions.deleteOne({ _id: previous });
  res.cookie(cookieName, token, { ...cookieOptions, maxAge: duration });
  res.status(status).json({ user: publicUser(user) });
}

async function authenticate(req, res) {
  const { action, email, password, name } = req.body ?? {};
  const address = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!["register", "login"].includes(action) || address.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ||
      typeof password !== "string" || password.length < 8 || password.length > 128) {
    return res.status(400).json({ error: "ایمیل یا رمز عبور معتبر نیست." });
  }

  if (action === "login") {
    const user = await users.findOne({ _id: address });
    if (!await verifyPassword(password, user?.credentials)) {
      return res.status(401).json({ error: "ایمیل یا رمز عبور اشتباه است." });
    }
    if (needsPasswordUpgrade(user.credentials)) {
      const credentials = await hashPassword(password);
      await users.updateOne(
        { _id: user._id, "credentials.hash": user.credentials.hash },
        { $set: { credentials } },
      );
    }
    return establishSession(req, res, user, 200);
  }

  const displayName = typeof name === "string" ? name.trim() : "";
  if (!displayName || displayName.length > 80) {
    return res.status(400).json({ error: "نام باید بین ۱ تا ۸۰ کاراکتر باشد." });
  }

  const user = {
    _id: address,
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
  res.clearCookie(cookieName, cookieOptions).status(204).end();
}

app.use("/api/auth", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.route("/api/auth")
  .get(currentUser)
  .post(express.json({ limit: "4kb" }), authenticate)
  .delete(logout);

app.use((error, _req, res, _next) => {
  if (error.status === 400 || error.status === 413) {
    return res.status(error.status).json({ error: "درخواست نامعتبر است." });
  }
  console.error(error.name);
  res.status(500).json({ error: "درخواست انجام نشد. دوباره تلاش کنید." });
});

export default app;
