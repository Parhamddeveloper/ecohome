import { createHash } from "node:crypto";
import { sessionsCollection, usersCollection } from "./database.js";

export const cookieName = "ecohome_session";

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function sessionToken(req) {
  const cookies = (req.get("Cookie") ?? "").split(";").map((cookie) => cookie.trim());
  const token = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
  return token && /^[0-9a-f]{64}$/.test(token) ? token : null;
}

export function sessionId(req) {
  const token = sessionToken(req);
  return token ? hashToken(token) : null;
}

export async function findAccountSession(req) {
  const token = sessionToken(req);
  if (!token) return null;
  const session = await sessionsCollection.findOne({
    _id: hashToken(token),
    expiresAt: { $gt: new Date() },
  });
  if (!session) return null;
  const user = await usersCollection.findOne({ _id: session.userId });
  if (!user || (session.version ?? 0) !== (user.sessionVersion ?? 0)) return null;
  return { token, user, expiresAt: session.expiresAt };
}

export async function findSessionUser(req) {
  return (await findAccountSession(req))?.user ?? null;
}
