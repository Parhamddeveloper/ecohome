import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
const keyLength = 64;
const currentVersion = 2;
const scryptOptions = { N: 16384, r: 8, p: 5 };

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, keyLength, scryptOptions);
  return { version: currentVersion, salt: salt.toString("hex"), hash: hash.toString("hex") };
}

export async function verifyPassword(password, credentials) {
  const salt = Buffer.from(credentials?.salt ?? "0".repeat(32), "hex");
  const options = credentials && credentials.version === undefined ? {} : scryptOptions;
  const hash = await derive(password, salt, keyLength, options);
  return Boolean(credentials && timingSafeEqual(hash, Buffer.from(credentials.hash, "hex")));
}

export function needsPasswordUpgrade(credentials) {
  return credentials.version === undefined;
}
