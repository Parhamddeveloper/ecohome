import express from "express";
import { projectsCollection } from "../server/database.js";

const app = express();

async function listProjects(req, res) {
  const type = new URL(req.originalUrl, "http://localhost").searchParams.get("type");
  const filter = type && type !== "all" ? { type } : {};
  const projects = await projectsCollection.find(filter, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray();

  res.json(projects);
}

function methodNotAllowed(_req, res) {
  res.set("Allow", "GET").status(405).json({ error: "Method not allowed" });
}

app.disable("x-powered-by");
app.route("/api/projects").head(methodNotAllowed).get(listProjects).all(methodNotAllowed);
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Could not load projects" });
});

export default app;
