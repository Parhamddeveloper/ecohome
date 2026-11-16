import express from "express";
import multer from "multer";
import { TEAM_PHOTO_LIMIT, TEAM_PHOTO_LIMIT_LABEL } from "../data/team-photo.js";
import { randomUUID } from "node:crypto";
import { teamMembersCollection, teamSettingsCollection } from "../server/database.js";
import { requireRole } from "../server/roles.js";
import { parseTeamPhoto } from "../server/team-photos.js";

const app = express();
app.disable("x-powered-by");
const projection = { _id: 0, id: 1, name: 1, role: 1, image: 1, text: 1 };
const limits = { name: 100, role: 120, image: 1000, text: 2000 };
const tooLarge = `حجم تصویر باید حداکثر ${TEAM_PHOTO_LIMIT_LABEL} مگابایت باشد.`;
const readJson = express.json({ limit: "24kb" });
const readPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TEAM_PHOTO_LIMIT, files: 1, fields: 4, fieldSize: 8192 },
}).single("photo");

function parseId(value) {
  const id = Number(value);
  return /^[1-9][0-9]*$/.test(value ?? "") && Number.isSafeInteger(id) ? id : null;
}

async function listTeamMembers(req, res) {
  const params = new URL(req.originalUrl, "http://localhost").searchParams;
  if (params.has("photo")) {
    const id = parseId(params.get("photo"));
    const member = id && await teamMembersCollection.findOne(
      { _id: id }, { projection: { photo: 1 } },
    );
    if (!member?.photo) return res.status(404).end();
    return res.set({
      "Content-Type": member.photo.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    }).send(Buffer.from(member.photo.bytes.value()));
  }

  const [members, order] = await Promise.all([
    teamMembersCollection.find({}, { projection }).sort({ id: 1 }).toArray(),
    teamSettingsCollection.findOne({ _id: "displayOrder" }),
  ]);
  const positions = new Map((order?.ids ?? []).map((id, index) => [id, index]));
  members.sort((first, second) =>
    (positions.get(first.id) ?? Infinity) - (positions.get(second.id) ?? Infinity) || first.id - second.id);
  res.json(members);
}

async function reorderTeam(req, res) {
  const ids = req.body?.order;
  if (!Array.isArray(ids) || !ids.every((id) => Number.isSafeInteger(id) && id > 0)) {
    return res.status(400).json({ error: "ترتیب اعضا معتبر نیست." });
  }
  const memberIds = await teamMembersCollection.distinct("id");
  const requested = new Set(ids);
  if (ids.length !== memberIds.length || requested.size !== ids.length ||
      !memberIds.every((id) => requested.has(id))) {
    return res.status(400).json({ error: "ترتیب باید شامل همهٔ اعضای فعلی باشد." });
  }
  await teamSettingsCollection.updateOne({ _id: "displayOrder" }, { $set: { ids } }, { upsert: true });
  res.status(204).end();
}

function validImagePath(value) {
  return /^\/(?!\/)[^\\?#]+\.(?:webp|png|jpe?g|avif)$/i.test(value)
    && !Array.from(value).some((character) => character.charCodeAt(0) < 32)
    && !value.split("/").some((part) => part === "." || part === "..");
}

async function updateTeamMember(req, res) {
  const rawId = new URL(req.originalUrl, "http://localhost").searchParams.get("id");
  const id = parseId(rawId);
  if (!id) {
    return res.status(400).json({ error: "شناسهٔ عضو معتبر نیست." });
  }
  if (!req.is(["application/json", "multipart/form-data"])) {
    return res.status(415).json({ error: "فرمت درخواست معتبر نیست." });
  }

  const body = req.body ?? {};
  if (Array.isArray(body) || (!req.file && Object.keys(body).length === 0)) {
    return res.status(400).json({ error: "اطلاعات عضو را وارد کن." });
  }
  const changes = {};
  for (const [key, value] of Object.entries(body)) {
    if (!Object.hasOwn(limits, key) || typeof value !== "string") {
      return res.status(400).json({ error: "فیلد یا مقدار معتبر نیست." });
    }
    const text = value.trim();
    if (!text || text.length > limits[key] || (key === "image" && !validImagePath(text))) {
      return res.status(400).json({ error: "نام، سمت، توضیحات یا مسیر تصویر معتبر نیست." });
    }
    changes[key] = text;
  }

  if (req.file) {
    if (req.file.size > TEAM_PHOTO_LIMIT) {
      return res.status(413).json({ error: tooLarge });
    }
    const uploaded = parseTeamPhoto(req.file.buffer);
    if (!uploaded) return res.status(400).json({ error: "تصویر باید PNG، JPEG یا WebP باشد." });
    changes.photo = uploaded;
    changes.image = `/api/team-members?photo=${id}&v=${randomUUID()}`;
  }
  const update = { $set: changes };
  if (changes.image && !changes.photo) update.$unset = { photo: "" };
  const member = await teamMembersCollection.findOneAndUpdate(
    { _id: id }, update, { projection, returnDocument: "after" },
  );
  if (!member) return res.status(404).json({ error: "عضو تیم پیدا نشد." });
  res.json(member);
}

function methodNotAllowed(_req, res) {
  res.set("Allow", "GET, PUT, PATCH").status(405).json({ error: "Method not allowed" });
}

app.route("/api/team-members")
  .head(methodNotAllowed)
  .get(listTeamMembers)
  .put(requireRole("superadmin"), readJson, reorderTeam)
  .patch(requireRole("superadmin"), readJson, readPhoto, updateTeamMember)
  .all(methodNotAllowed);

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: tooLarge });
    }
    return res.status(400).json({ error: "فیلدهای آپلود معتبر نیستند. فقط یک عکس مجاز است." });
  }
  if (error.status === 400 || error.status === 413) {
    return res.status(error.status).json({ error: "درخواست معتبر نیست." });
  }
  console.error(error);
  res.status(500).json({ error: "Could not load team members" });
});

export default app;
