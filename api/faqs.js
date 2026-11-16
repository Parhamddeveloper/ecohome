import express from "express";
import { ObjectId } from "mongodb";
import { faqsCollection, faqSettingsCollection } from "../server/database.js";
import { requireRole } from "../server/roles.js";

const app = express();
app.disable("x-powered-by");

const projection = { _id: 0, id: 1, question: 1, answer: 1 };
const activeFaq = { deletedAt: { $exists: false } };

async function listFaqs(_req, res) {
  const [faqs, order] = await Promise.all([
    faqsCollection.find(activeFaq, { projection }).sort({ id: 1 }).toArray(),
    faqSettingsCollection.findOne({ _id: "displayOrder" }),
  ]);
  const positions = new Map((order?.ids ?? []).map((id, index) => [id, index]));
  res.json(faqs.sort((first, second) =>
    (positions.get(first.id) ?? faqs.length) - (positions.get(second.id) ?? faqs.length)));
}

const requireFaqEditor = requireRole("admin", "superadmin");

async function reorderFaqs(req, res) {
  const ids = req.body?.order;
  if (!Array.isArray(ids)) return res.status(400).json({ error: "ترتیب سؤال‌ها معتبر نیست." });
  const activeIds = await faqsCollection.distinct("id", activeFaq);
  const requested = new Set(ids);
  if (ids.length !== activeIds.length || requested.size !== ids.length ||
      !activeIds.every((id) => requested.has(id))) {
    return res.status(400).json({ error: "ترتیب باید شامل همهٔ سؤال‌های فعلی باشد." });
  }
  await faqSettingsCollection.updateOne({ _id: "displayOrder" }, { $set: { ids } }, { upsert: true });
  res.status(204).end();
}

function requireFaqId(req, res, next) {
  const idParam = new URL(req.originalUrl, "http://localhost").searchParams.get("id");
  const id = Number(idParam);
  if (/^[a-f0-9]{24}$/.test(idParam ?? "")) {
    res.locals.faqId = idParam;
  } else if (/^[1-9][0-9]*$/.test(idParam ?? "") && Number.isSafeInteger(id)) {
    res.locals.faqId = id;
  } else {
    return res.status(400).json({ error: "A valid FAQ id is required" });
  }
  next();
}

function validateFaqFields(req, res, next) {
  if (!req.is("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }

  const body = req.body;
  const fields = { question: 300, answer: 5000 };
  if (!body || Array.isArray(body) || Object.keys(body).length === 0) {
    return res.status(400).json({ error: "Provide a question or answer" });
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
  res.locals.faqFields = changes;
  next();
}

async function createFaq(_req, res) {
  const { question, answer } = res.locals.faqFields;
  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" });
  }
  const id = new ObjectId().toHexString();
  const faq = { id, question, answer };
  await faqsCollection.insertOne({ _id: id, ...faq });
  res.status(201).json(faq);
}

async function updateFaq(_req, res) {
  const faq = await faqsCollection.findOneAndUpdate(
    { _id: res.locals.faqId, ...activeFaq },
    { $set: res.locals.faqFields },
    { projection, returnDocument: "after" },
  );
  if (!faq) return res.status(404).json({ error: "FAQ not found" });
  res.json(faq);
}

async function deleteFaq(_req, res) {
  const result = await faqsCollection.updateOne(
    { _id: res.locals.faqId, ...activeFaq },
    { $set: { deletedAt: new Date() } },
  );
  if (!result.matchedCount) return res.status(404).json({ error: "FAQ not found" });
  res.status(204).end();
}

function methodNotAllowed(_req, res) {
  res.set("Allow", "GET, POST, PUT, PATCH, DELETE").status(405).json({ error: "Method not allowed" });
}

const readJson = express.json({ limit: "32kb" });

app.route("/api/faqs")
  .head(methodNotAllowed)
  .get(listFaqs)
  .post(requireFaqEditor, readJson, validateFaqFields, createFaq)
  .put(requireFaqEditor, readJson, reorderFaqs)
  .patch(requireFaqEditor, requireFaqId, readJson, validateFaqFields, updateFaq)
  .delete(requireFaqEditor, requireFaqId, deleteFaq)
  .all(methodNotAllowed);

app.use((error, _req, res, _next) => {
  if (error.status === 413) return res.status(413).json({ error: "Request is too large" });
  if (error.status === 400) return res.status(400).json({ error: "Invalid JSON body" });
  console.error(error);
  res.status(500).json({ error: "Could not process the FAQ request" });
});

export default app;
