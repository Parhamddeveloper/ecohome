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
  const fields = [...Object.keys(textLimits), "type", "thumbnail", "gallery"];
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
  if (!project.title || !project.text || typeof body.type !== "string" ||
      !Object.hasOwn(projectTypes, body.type)) {
    return res.status(400).json({ error: "عنوان، خلاصه و دسته‌بندی را وارد کن." });
  }
  if (!validImage(body.thumbnail) || !Array.isArray(body.gallery) ||
      body.gallery.length > 12 || !body.gallery.every(validImage)) {
    return res.status(400).json({ error: "مسیر عکس اصلی و حداکثر ۱۲ عکس گالری باید معتبر باشد." });
  }
  res.locals.project = {
    ...project, type: body.type, thumbnail: body.thumbnail, gallery: [...new Set(body.gallery)],
  };
  next();
}

const readJson = express.json({ limit: "96kb" });
function contentApi(path, collection) {
  const app = express();
  app.disable("x-powered-by");
  app.use(path, requireRole("admin", "superadmin"));
  app.route(path)
    .post(readJson, validateProject, async (_req, res) => {
      const id = new ObjectId().toHexString();
      const item = { ...res.locals.project, id };
      item.date ||= new Date().toISOString().slice(0, 10);
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
