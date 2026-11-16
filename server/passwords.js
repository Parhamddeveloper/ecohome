import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
const keyLength = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, keyLength);
  return { salt: salt.toString("hex"), hash: hash.toString("hex") };
}

export async function verifyPassword(password, credentials) {
  const salt = Buffer.from(credentials?.salt ?? "0".repeat(32), "hex");
  const hash = await derive(password, salt, keyLength);
  return Boolean(credentials && timingSafeEqual(hash, Buffer.from(credentials.hash, "hex")));
}
