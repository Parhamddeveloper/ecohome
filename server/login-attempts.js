import { createHash } from "node:crypto";
import { loginAttemptsCollection } from "./database.js";

const windowMs = 15 * 60 * 1000;
const attemptLimit = 5;

export async function reserveLoginAttempt(email) {
  const windowEnd = (Math.floor(Date.now() / windowMs) + 1) * windowMs;
  const emailHash = createHash("sha256").update(email).digest("hex");
  const id = `${emailHash}:${windowEnd}`;
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
    allowed: bucket.attempts <= attemptLimit,
    retryAfter: Math.max(1, Math.ceil((windowEnd - Date.now()) / 1000)),
  };
}

export async function releaseLoginAttempt(id) {
  await loginAttemptsCollection.updateOne({ _id: id }, { $inc: { attempts: -1 } });
}
