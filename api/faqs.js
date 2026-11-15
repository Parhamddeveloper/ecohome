import { createHash, timingSafeEqual } from "node:crypto";
import express from "express";
import { faqsCollection } from "../server/database.js";

const app = express();
app.disable("x-powered-by");

const projection = { _id: 0, id: 1, question: 1, answer: 1 };

async function listFaqs(_req, res) {
  const faqs = await faqsCollection.find({}, { projection }).sort({ id: 1 }).toArray();
  res.json(faqs);
}

function digest(value) {
  return createHash("sha256").update(value).digest();
}

function requireFaqEditor(req, res, next) {
  const token = process.env.FAQ_ADMIN_TOKEN;
  if (!token || token.length < 32) {
    return res.status(503).json({ error: "FAQ editing is unavailable" });
  }

  const authorization = req.get("Authorization") ?? "";
  if (!timingSafeEqual(digest(authorization), digest(`Bearer ${token}`))) {
    return res.set("WWW-Authenticate", "Bearer").status(401).json({ error: "Unauthorized" });
  }

  next();
}

async function updateFaq(req, res) {
  const idParam = new URL(req.originalUrl, "http://localhost").searchParams.get("id");
  const id = Number(idParam);
  if (!/^[1-9][0-9]*$/.test(idParam ?? "") || !Number.isSafeInteger(id)) {
    return res.status(400).json({ error: "A valid FAQ id is required" });
  }

  if (!req.is("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }

  const body = req.body;
  const fields = { question: 300, answer: 5000 };
  if (!body || Array.isArray(body) || Object.keys(body).length === 0) {
    return res.status(400).json({ error: "Provide a question or answer to update" });
  }

  const changes = {};
  for (const [field, value] of Object.entries(body)) {
    if (!Object.hasOwn(fields, field) || typeof value !== "string") {
      return res.status(400).json({ error: "Only question and answer text may be updated" });
    }
    const text = value.trim();
    if (!text || text.length > fields[field]) {
      return res.status(400).json({ error: `${field} must contain 1 to ${fields[field]} characters` });
    }
    changes[field] = text;
  }

  const faq = await faqsCollection.findOneAndUpdate(
    { _id: id },
    { $set: changes },
    { projection, returnDocument: "after" },
  );
  if (!faq) return res.status(404).json({ error: "FAQ not found" });
  res.json(faq);
}

function methodNotAllowed(_req, res) {
  res.set("Allow", "GET, PATCH").status(405).json({ error: "Method not allowed" });
}

app.route("/api/faqs")
  .head(methodNotAllowed)
  .get(listFaqs)
  .patch(requireFaqEditor, express.json({ limit: "32kb" }), updateFaq)
  .all(methodNotAllowed);

app.use((error, _req, res, _next) => {
  if (error.status === 413) return res.status(413).json({ error: "Request is too large" });
  if (error.status === 400) return res.status(400).json({ error: "Invalid JSON body" });
  console.error(error);
  res.status(500).json({ error: "Could not process the FAQ request" });
});

export default app;
