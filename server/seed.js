import { weblogs } from "./weblog-seed-data.js";
import { projects } from "./project-seed-data.js";
import { teamMembers } from "./team-seed-data.js";
import { faqs } from "./faq-seed-data.js";
import {
  faqsCollection,
  loginAttemptsCollection,
  mongoClient,
  projectsCollection,
  sessionsCollection,
  teamMembersCollection,
  weblogsCollection,
} from "./database.js";

async function seedCollection(collection, records) {
  const operations = records.map((record) => ({
    updateOne: {
      filter: { _id: record.id },
      update: { $setOnInsert: record },
      upsert: true,
    },
  }));

  const { upsertedCount, matchedCount } = await collection.bulkWrite(operations);
  console.log(`${collection.collectionName}: ${upsertedCount} inserted, ${matchedCount} already present.`);
}

try {
  await seedCollection(projectsCollection, projects);
  await seedCollection(weblogsCollection, weblogs);
  await seedCollection(teamMembersCollection, teamMembers);
  await seedCollection(faqsCollection, faqs);
  await sessionsCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await loginAttemptsCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
} finally {
  await mongoClient.close();
}
