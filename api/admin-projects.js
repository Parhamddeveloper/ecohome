import express from "express";
import { ObjectId } from "mongodb";
import { projectTypes } from "../data/project-types.js";
import { projectsCollection, weblogsCollection } from "../server/database.js";
import { parseProjectId } from "../server/project-id.js";
import { requireRole } from "../server/roles.js";

const textLimits = { title: 120, text: 250, description: 10000, location: 120, year: 12, area: 24, author: 120, date: 40 };
const projection = { _id: 0 };

function validImage(value) {
  if (typeof value !== "string" || value.length > 1000 || value.includes("\\")) return false;
  try {
    const url = new URL(value, "https://local.invalid");
    return !url.username && !url.password &&
      ((value.startsWith("/") && url.origin === "https://local.invalid") || value.startsWith("https://"));
  } catch {
    return false;
  }
}

function validateProject(req, res, next) {
  const body = req.body;
  const fields = [...Object.keys(textLimits), "type", "thumbnail", "gallery", "status"];
  if (!body || Array.isArray(body) || Object.keys(body).some((field) => !fields.includes(field))) {
    return res.status(400).json({ error: "اطلاعات پروژه معتبر نیست." });
  }
  const project = {};
  for (const [field, max] of Object.entries(textLimits)) {
    const value = body[field] ?? "";
    if (typeof value !== "string" || value.trim().length > max) {
      return res.status(400).json({ error: "طول یا نوع یکی از فیلدهای متنی معتبر نیست." });
    }
    project[field] = value.trim();
  }
  const { status, type = "", thumbnail = "", gallery = [] } = body;
  if (!["draft", "published"].includes(status)) {
    return res.status(400).json({ error: "وضعیت انتشار معتبر نیست." });
  }
  const publishing = status === "published";
  if (!project.title || (publishing && (!project.text || !type)) ||
      (type !== "" && (typeof type !== "string" || !Object.hasOwn(projectTypes, type)))) {
    return res.status(400).json({ error: "عنوان، خلاصه و دسته‌بندی را وارد کن." });
  }
  if (((publishing || thumbnail !== "") && !validImage(thumbnail)) || !Array.isArray(gallery) ||
      gallery.length > 12 || !gallery.every(validImage)) {
    return res.status(400).json({ error: "مسیر عکس اصلی و حداکثر ۱۲ عکس گالری باید معتبر باشد." });
  }
  res.locals.project = {
    ...project, status, type, thumbnail, gallery: [...new Set(gallery)],
  };
  if (publishing && !project.date) res.locals.project.date = new Date().toISOString().slice(0, 10);
  next();
}

const readJson = express.json({ limit: "96kb" });
function contentApi(path, collection) {
  const app = express();
  app.disable("x-powered-by");
  app.use(path, (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  }, requireRole("admin", "superadmin"));
  app.route(path)
    .get(async (req, res) => {
      const params = new URL(req.originalUrl, "http://localhost").searchParams;
      if (!params.has("id")) {
        return res.json(await collection.find({}, { projection }).sort({ id: 1 }).toArray());
      }
      const id = parseProjectId(params.get("id"));
      if (id === null) return res.status(400).json({ error: "شناسه معتبر نیست." });
      const item = await collection.findOne({ id }, { projection });
      if (!item) return res.status(404).json({ error: "محتوا پیدا نشد." });
      res.json(item);
    })
    .post(readJson, validateProject, async (_req, res) => {
      const id = new ObjectId().toHexString();
      const item = { ...res.locals.project, id };
      await collection.insertOne({ _id: id, ...item });
      res.status(201).json(item);
    })
    .patch(readJson, validateProject, async (req, res) => {
      const id = parseProjectId(new URL(req.originalUrl, "http://localhost").searchParams.get("id"));
      if (id === null) return res.status(400).json({ error: "شناسه معتبر نیست." });
      const item = await collection.findOneAndUpdate(
        { id }, { $set: res.locals.project }, { projection, returnDocument: "after" },
      );
      if (!item) return res.status(404).json({ error: "محتوا پیدا نشد." });
      res.json(item);
    });

app.use((error, _req, res, _next) => {
  if (error.status === 400 || error.status === 413) {
    return res.status(error.status).json({ error: "درخواست معتبر نیست." });
  }
  console.error(error.name);
  res.status(500).json({ error: "ذخیرهٔ پروژه انجام نشد." });
  });
  return app;
}

export const adminWeblogsApi = contentApi("/api/admin-weblogs", weblogsCollection);
export default contentApi("/api/admin-projects", projectsCollection);
