import { usersCollection } from "./database.js";

let initialization;

export function ensureUserEmails() {
  initialization ??= initializeUserEmails().catch((error) => {
    initialization = undefined;
    throw error;
  });
  return initialization;
}

async function initializeUserEmails() {
  await usersCollection.updateMany(
    { email: { $exists: false }, _id: { $type: "string" } },
    [{ $set: { email: "$_id" } }],
  );
  await usersCollection.createIndex({ email: 1 }, { unique: true });
}
