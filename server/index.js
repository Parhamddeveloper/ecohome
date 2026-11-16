import express from "express";
import authApi from "../api/auth.js";
import faqsApi from "../api/faqs.js";
import projectsApi from "../api/projects.js";
import teamMembersApi from "../api/team-members.js";
import weblogsApi from "../api/weblogs.js";
import { mongoClient } from "./database.js";

const app = express();
app.disable("x-powered-by");
app.use(projectsApi, weblogsApi, teamMembersApi, faqsApi, authApi);

const port = Number(process.env.API_PORT || 3001);

try {
  await mongoClient.connect();
  const server = app.listen(port, "127.0.0.1");
  server.on("listening", () => {
    console.log(`EcoHome API listening on http://127.0.0.1:${port}`);
  });

  server.on("error", async (error) => {
    console.error(error);
    process.exitCode = 1;
    await mongoClient.close();
  });

  function shutdown() {
    server.close(async () => {
      await mongoClient.close();
    });
  }

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
  await mongoClient.close();
}
