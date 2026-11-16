import express from "express";
import multer from "multer";
import { ObjectId } from "mongodb";
import { TEAM_PHOTO_LIMIT } from "../data/team-photo.js";
import { mongoClient } from "../server/database.js";
import { requireRole } from "../server/roles.js";
import { parseTeamPhoto } from "../server/team-photos.js";

const app = express();
const media = mongoClient.db(process.env.MONGODB_DATABASE || "ecohome").collection("media");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TEAM_PHOTO_LIMIT, files: 1, fields: 0 },
}).single("photo");

app.route("/api/media")
  .get(async (req, res) => {
    const id = new URL(req.originalUrl, "http://localhost").searchParams.get("id");
    if (!/^[a-f0-9]{24}$/.test(id ?? "")) return res.status(404).end();
    const photo = await media.findOne({ _id: id });
    if (!photo) return res.status(404).end();
    res.set({
      "Content-Type": photo.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    }).send(Buffer.from(photo.bytes.value()));
  })
  .post(requireRole("admin", "superadmin"), upload, async (req, res) => {
    const photo = req.file && parseTeamPhoto(req.file.buffer);
    if (!photo) return res.status(400).json({ error: "یک تصویر PNG، JPEG یا WebP معتبر انتخاب کن." });
    const id = new ObjectId().toHexString();
    await media.insertOne({ _id: id, ...photo });
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
