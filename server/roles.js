import { findSessionUser } from "./sessions.js";

export function requireRole(...roles) {
  return async function authorize(req, res, next) {
    const user = await findSessionUser(req);
    if (!user) return res.status(401).json({ error: "Sign in to continue" });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
