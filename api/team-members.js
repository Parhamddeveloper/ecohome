import express from "express";
import { teamMembersCollection } from "../server/database.js";

const app = express();
app.disable("x-powered-by");

async function listTeamMembers(_req, res) {
  const members = await teamMembersCollection.find({}, {
    projection: { _id: 0, id: 1, name: 1, role: 1, image: 1, text: 1 },
  }).sort({ id: 1 }).toArray();

  res.json(members);
}

function methodNotAllowed(_req, res) {
  res.set("Allow", "GET").status(405).json({ error: "Method not allowed" });
}

app.route("/api/team-members")
  .head(methodNotAllowed)
  .get(listTeamMembers)
  .all(methodNotAllowed);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Could not load team members" });
});

export default app;
