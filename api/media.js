import express from "express";
import multer from "multer";
import { ObjectId } from "mongodb";
import { TEAM_PHOTO_LIMIT } from "../data/team-photo.js";
import { mediaCollection, projectsCollection, weblogsCollection } from "../server/database.js";
import { publicContent } from "../server/content-status.js";
import { requireRole } from "../server/roles.js";
import { findSessionUser } from "../server/sessions.js";
import { parseTeamPhoto } from "../server/team-photos.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TEAM_PHOTO_LIMIT, files: 1, fields: 0 },
}).single("photo");

async function canReadPhoto(req, id) {
  const url = `/api/media?id=${id}`;
  const filter = { ...publicContent, $or: [{ thumbnail: url }, { gallery: url }] };
  const options = { projection: { _id: 1 } };
  const [project, article] = await Promise.all([
    projectsCollection.findOne(filter, options),
    weblogsCollection.findOne(filter, options),
  ]);
  if (project || article) return true;
  const user = await findSessionUser(req);
  return ["admin", "superadmin"].includes(user?.role);
}

app.route("/api/media")
  .get(async (req, res) => {
    res.set("Cache-Control", "private, no-store");
    const id = new URL(req.originalUrl, "http://localhost").searchParams.get("id");
    if (!/^[a-f0-9]{24}$/.test(id ?? "")) return res.status(404).end();
    if (!await canReadPhoto(req, id)) return res.status(404).end();
    const photo = await mediaCollection.findOne({ _id: id });
    if (!photo) return res.status(404).end();
    res.set({
      "Content-Type": photo.contentType,
      "X-Content-Type-Options": "nosniff",
    }).send(Buffer.from(photo.bytes.value()));
  })
  .post(requireRole("admin", "superadmin"), upload, async (req, res) => {
    const photo = req.file && parseTeamPhoto(req.file.buffer);
    if (!photo) return res.status(400).json({ error: "یک تصویر PNG، JPEG یا WebP معتبر انتخاب کن." });
    const id = new ObjectId().toHexString();
    await mediaCollection.insertOne({ _id: id, ...photo });
    res.status(201).json({ url: `/api/media?id=${id}` });
  });

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const tooLarge = error.code === "LIMIT_FILE_SIZE";
    return res.status(tooLarge ? 413 : 400).json({
      error: tooLarge ? "حجم عکس باید حداکثر ۴ مگابایت باشد." : "در هر درخواست فقط یک عکس بفرست.",
    });
  }
  console.error(error.name);
  res.status(500).json({ error: "پردازش تصویر انجام نشد." });
});

export default app;
