import { MongoClient } from "mongodb";

const configuredUri = process.env.MONGODB_URI?.trim();
const configuredDatabase = process.env.MONGODB_DATABASE?.trim();

if (process.env.VERCEL === "1" && (!configuredUri || !configuredDatabase)) {
  throw new Error("Vercel requires MONGODB_URI and MONGODB_DATABASE.");
}

const uri = configuredUri || "mongodb://127.0.0.1:27017";
const databaseName = configuredDatabase || "ecohome";

export const mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
export const mediaCollection = mongoClient.db(databaseName).collection("media");
export const projectsCollection = mongoClient.db(databaseName).collection("projects");
export const weblogsCollection = mongoClient.db(databaseName).collection("weblogs");
export const teamMembersCollection = mongoClient.db(databaseName).collection("teamMembers");
export const teamSettingsCollection = mongoClient.db(databaseName).collection("teamSettings");
export const faqsCollection = mongoClient.db(databaseName).collection("faqs");
export const faqSettingsCollection = mongoClient.db(databaseName).collection("faqSettings");
export const usersCollection = mongoClient.db(databaseName).collection("users");
export const sessionsCollection = mongoClient.db(databaseName).collection("sessions");
export const loginAttemptsCollection = mongoClient.db(databaseName).collection("loginAttempts");
