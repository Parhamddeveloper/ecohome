import express from "express";
import { projectsCollection } from "../server/database.js";
import { parseProjectId } from "../server/project-id.js";
import { publicContent } from "../server/content-status.js";

const app = express();

async function listProjects(req, res) {
  const params = new URL(req.originalUrl, "http://localhost").searchParams;
  if (params.has("id")) {
    const id = parseProjectId(params.get("id"));
    if (id === null) {
      return res.status(400).json({ error: "Invalid project id" });
    }
    const project = await projectsCollection.findOne({ id, ...publicContent }, { projection: { _id: 0 } });
    if (!project) return res.status(404).json({ error: "Project not found" });
    return res.json(project);
  }

  const type = params.get("type");
  const filter = { ...publicContent };
  if (type && type !== "all") filter.type = type;
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
