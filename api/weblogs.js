import express from "express";
import { WEBLOG_SEARCH_LIMIT } from "../data/weblog-search.js";
import { weblogsCollection } from "../server/database.js";
import { parseProjectId } from "../server/project-id.js";

const app = express();
app.disable("x-powered-by");

async function listWeblogs(req, res) {
  const params = new URL(req.originalUrl, "http://localhost").searchParams;
  if (params.has("id")) {
    const id = parseProjectId(params.get("id"));
    if (id === null) return res.status(400).json({ error: "Invalid article id" });
    const article = await weblogsCollection.findOne({ id }, { projection: { _id: 0 } });
    if (!article) return res.status(404).json({ error: "Article not found" });
    return res.json(article);
  }
  const type = params.get("type");
  const query = params.get("q") ?? "";
  if (query.length > WEBLOG_SEARCH_LIMIT) {
    return res.status(400).json({
      error: `Search must be at most ${WEBLOG_SEARCH_LIMIT} characters`,
    });
  }

  const search = query.trim();
  const filter = type && type !== "all" ? { type } : {};
  if (search) {
    const literalSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = { $regex: literalSearch, $options: "i" };
    filter.$or = [{ title: match }, { text: match }];
  }
  const weblogs = await weblogsCollection.find(filter, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray();

  res.json(weblogs);
}

function methodNotAllowed(_req, res) {
  res.set("Allow", "GET").status(405).json({ error: "Method not allowed" });
}

app.route("/api/weblogs")
  .head(methodNotAllowed)
  .get(listWeblogs)
  .all(methodNotAllowed);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Could not load weblogs" });
});

export default app;
