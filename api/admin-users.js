import express from "express";
import { usersCollection } from "../server/database.js";
import { requireRole } from "../server/roles.js";

const app = express();
const projection = { _id: 1, name: 1, email: 1, role: 1 };
const pageSize = 25;

function accountSummary(user) {
  return { id: user._id, name: user.name, email: user.email ?? user._id, role: user.role };
}

async function listAccounts(req, res) {
  const page = Number(new URL(req.originalUrl, "http://localhost").searchParams.get("page") ?? 1);
  if (!Number.isSafeInteger(page) || page < 1 || page > 10000) {
    return res.status(400).json({ error: "شمارهٔ صفحه معتبر نیست." });
  }
  const accounts = await usersCollection.find({}, { projection }).sort({ _id: 1 })
    .skip((page - 1) * pageSize).limit(pageSize + 1).toArray();
  res.json({ accounts: accounts.slice(0, pageSize).map(accountSummary), hasNext: accounts.length > pageSize });
}

async function updateRole(req, res) {
  const { id, role } = req.body ?? {};
  if (typeof id !== "string" || !id || id.length > 254 || !["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "حساب یا نقش انتخاب‌شده معتبر نیست." });
  }
  const user = await usersCollection.findOneAndUpdate(
    { _id: id, role: { $in: ["user", "admin"] } },
    { $set: { role } },
    { projection, returnDocument: "after" },
  );
  if (!user) return res.status(404).json({ error: "این حساب برای تغییر نقش در دسترس نیست." });
  res.json(accountSummary(user));
}

async function deleteAccount(req, res) {
  const id = new URL(req.originalUrl, "http://localhost").searchParams.get("id");
  if (!id || id.length > 254) {
    return res.status(400).json({ error: "شناسهٔ حساب معتبر نیست." });
  }
  const result = await usersCollection.deleteOne({ _id: id, role: { $in: ["user", "admin"] } });
  if (!result.deletedCount) return res.status(404).json({ error: "این حساب قابل حذف نیست." });
  res.status(204).end();
}

app.disable("x-powered-by");
app.use("/api/admin-users", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
}, requireRole("superadmin"));
app.route("/api/admin-users")
  .get(listAccounts)
  .patch(express.json({ limit: "2kb" }), updateRole)
  .delete(deleteAccount);

app.use((error, _req, res, _next) => {
  if (error.status === 400 || error.status === 413) {
    return res.status(error.status).json({ error: "درخواست معتبر نیست." });
  }
  console.error(error.name);
  res.status(500).json({ error: "مدیریت حساب‌ها فعلاً در دسترس نیست." });
});

export default app;
