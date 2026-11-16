import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { loginAttemptsCollection } from "./database.js";

const windowMs = 15 * 60 * 1000;
const attemptLimit = 5;

async function reserveAttempt(key, limit, prefix = "") {
  const windowEnd = (Math.floor(Date.now() / windowMs) + 1) * windowMs;
  const keyHash = createHash("sha256").update(key).digest("hex");
  const id = `${prefix}${keyHash}:${windowEnd}`;
  const filter = { _id: id };
  const update = { $inc: { attempts: 1 } };

  let bucket;
  try {
    bucket = await loginAttemptsCollection.findOneAndUpdate(
      filter,
      { ...update, $setOnInsert: { expiresAt: new Date(windowEnd) } },
      { upsert: true, returnDocument: "after" },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    bucket = await loginAttemptsCollection.findOneAndUpdate(
      filter, update, { returnDocument: "after" },
    );
    if (!bucket) throw error;
  }

  return {
    id,
    allowed: bucket.attempts <= limit,
    retryAfter: Math.max(1, Math.ceil((windowEnd - Date.now()) / 1000)),
  };
}

export function reserveLoginAttempt(email) {
  return reserveAttempt(email, attemptLimit);
}

export function reserveAuthRequest(req, action) {
  const forwarded = process.env.VERCEL === "1" ? req.get("x-vercel-forwarded-for")?.trim() : null;
  const address = isIP(forwarded ?? "") ? forwarded : req.socket.remoteAddress ?? "unknown";
  const registering = action === "register";
  return reserveAttempt(address, registering ? 5 : 30, registering ? "ip:register:" : "ip:login:");
}

export async function releaseLoginAttempt(id) {
  await loginAttemptsCollection.updateOne({ _id: id }, { $inc: { attempts: -1 } });
}
