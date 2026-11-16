import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectTypes } from "../../../data/project-types.js";
import { TEAM_PHOTO_LIMIT } from "../../../data/team-photo.js";

const inputClass = "w-full rounded-lg border border-stone-300 bg-transparent px-3 py-2 dark:border-gray-600";
const textFields = [
  { name: "title", label: "عنوان", max: 120, required: true },
  { name: "text", label: "خلاصهٔ کارت پروژه", max: 250, required: true },
  { name: "location", label: "موقعیت", max: 120 },
  { name: "year", label: "سال اجرا", max: 12 },
  { name: "area", label: "مساحت به مترمربع", max: 24 },
];

function ProjectForm({ project, article, onSave, onCancel }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");
  const [gallery, setGallery] = useState(project?.gallery?.join("\n") ?? "");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(project ? project.status ?? "published" : "draft");
  const publishing = status === "published";

  async function uploadImages(event, cover) {
    const files = Array.from(event.target.files);
    event.target.value = "";
    if (!files.length) return;
    const count = gallery.split(/\r?\n/).filter((line) => line.trim()).length;
    if (files.some((file) => file.size > TEAM_PHOTO_LIMIT) || (!cover && count + files.length > 12)) {
      setError("هر عکس حداکثر ۴ مگابایت و گالری حداکثر ۱۲ عکس است.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      for (const file of files) {
        const body = new FormData();
        body.set("photo", file);
        const response = await fetch("/api/media", { method: "POST", body });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || "آپلود عکس انجام نشد.");
        }
        const { url } = await response.json();
        if (cover) setThumbnail(url);
        else setGallery((current) => [current.trim(), url].filter(Boolean).join("\n"));
      }
    } catch (error) {
      setError(error.message || "آپلود عکس انجام نشد.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    fields.thumbnail = fields.thumbnail.trim();
    fields.gallery = fields.gallery.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    setSaving(true);
    setError("");
    try {
      const query = project ? `?${new URLSearchParams({ id: project.id })}` : "";
      const response = await fetch(`/api/admin-${article ? "weblogs" : "projects"}${query}`, {
        method: project ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(response.status === 401 || response.status === 403
          ? "برای مدیریت پروژه‌ها با حساب مدیر وارد شو."
          : data.error);
        return;
      }
      onSave(data);
    } catch {
      setError("ذخیرهٔ پروژه انجام نشد. دوباره تلاش کن.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <fieldset disabled={saving || uploading} className="grid gap-4">
        <legend className="mb-4 font-estedad-bold">{project ? "ویرایش محتوا" : article ? "مقالهٔ جدید" : "پروژهٔ جدید"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(article ? textFields.slice(0, 2) : textFields).map(({ name, label, max, required }) => (
            <label key={name} className="grid gap-1 text-sm">
              {label}
              <input name={name} defaultValue={project?.[name]} maxLength={max}
                required={name === "title" || (required && publishing)} className={inputClass} />
            </label>
          ))}
          <label className="grid gap-1 text-sm">
            نویسنده
            <input name="author" defaultValue={project?.author} maxLength={120} className={inputClass} />
          </label>
          <label className="grid gap-1 text-sm">
            تاریخ انتشار
            <input name="date" defaultValue={project?.date} placeholder="YYYY-MM-DD" maxLength={40} dir="ltr" className={inputClass} />
          </label>
          <label className="grid gap-1 text-sm">
            دسته‌بندی
            <select name="type" required={publishing} defaultValue={project?.type ?? ""} className={`${inputClass} dark:bg-gray-900`}>
              <option value="">انتخاب دسته‌بندی</option>
              {Object.entries(projectTypes).map(([value, title]) => <option key={value} value={value}>{title}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            وضعیت انتشار
            <select name="status" value={status} onChange={(event) => setStatus(event.target.value)}
              className={`${inputClass} dark:bg-gray-900`}>
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشرشده</option>
            </select>
          </label>
        </div>
        <label className="grid gap-1 text-sm">
          {article ? "متن مقاله" : "توضیحات پروژه"}
          <textarea name="description" defaultValue={project?.description} maxLength={10000} rows={6} className={inputClass} />
        </label>
        <label className="grid gap-1 text-sm">
          آدرس عکس اصلی
          <input name="thumbnail" dir="ltr" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)}
            placeholder="/project1.jpg" maxLength={1000} required={publishing} className={inputClass} />
        </label>
        <label className="grid gap-1 text-sm">آپلود عکس اصلی
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadImages(event, true)} className={inputClass} />
        </label>
        <label className="grid gap-1 text-sm">
          آدرس عکس‌های گالری
          <span className="text-stone-600 dark:text-gray-300">حداکثر ۱۲ عکس. هر آدرس را در یک خط وارد کن.</span>
          <textarea name="gallery" dir="ltr" value={gallery} onChange={(event) => setGallery(event.target.value)} maxLength={12012} rows={4} className={inputClass} />
        </label>
        <label className="grid gap-1 text-sm">آپلود عکس‌های گالری
          <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadImages(event, false)} className={inputClass} />
        </label>
        {uploading && <p role="status">در حال آپلود عکس…</p>}
        {error && <p role="alert" className="text-red-700 dark:text-red-300">{error}</p>}
        <div className="flex gap-2">
          <button className="rounded-lg bg-[#596348] px-4 py-2 text-white">
            {saving ? "در حال ذخیره…" : publishing ? "ذخیره و انتشار" : "ذخیرهٔ پیش‌نویس"}
          </button>
          <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2">انصراف</button>
        </div>
      </fieldset>
    </form>
  );
}

export default function ProjectManagement({ article = false }) {
  const resource = article ? "weblogs" : "projects";
  const [result, setResult] = useState(null);
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/admin-${resource}`, { signal: controller.signal });
        if (!response.ok) throw new Error();
        const projects = await response.json();
        if (!controller.signal.aborted) setResult({ projects });
      } catch {
        if (!controller.signal.aborted) setResult({ error: "بارگذاری محتوا انجام نشد." });
      }
    }
    load();
    return () => controller.abort();
  }, [resource]);

  function save(updated) {
    setResult(({ projects }) => ({
      projects: editing.project
        ? projects.map((project) => project.id === updated.id ? updated : project)
        : [...projects, updated],
    }));
    setEditing(null);
    setSaved(true);
  }

  if (!result) return <p role="status">در حال بارگذاری محتوا…</p>;
  if (result.error) return <p role="alert">{result.error}</p>;
  if (editing) return <ProjectForm project={editing.project} article={article} onSave={save} onCancel={() => setEditing(null)} />;

  return (
    <div className="grid gap-4">
      <button type="button" onClick={() => { setSaved(false); setEditing({}); }}
        className="w-fit rounded-lg bg-[#596348] px-4 py-2 text-white">{article ? "افزودن مقاله" : "افزودن پروژه"}</button>
      {saved && <p role="status">تغییرات ذخیره شد.</p>}
      {result.projects.length === 0 && <p>محتوایی ثبت نشده است.</p>}
      <ul className="grid gap-2">
        {result.projects.map((project) => (
          <li key={project.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 p-3 dark:border-gray-700">
            {project.thumbnail && <img src={project.thumbnail} alt="" loading="lazy" className="size-12 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="font-estedad-bold">{project.title}</p>
              <p className="text-sm text-stone-600 dark:text-gray-300">{projectTypes[project.type]}</p>
            </div>
            <span className="rounded-full bg-[#869074]/20 px-3 py-1 text-sm">
              {project.status === "draft" ? "پیش‌نویس" : "منتشرشده"}
            </span>
            <Link to={`/${resource}/${project.id}?preview=1`} className="rounded-lg px-2 py-1 text-sm underline">پیش‌نمایش</Link>
            <button type="button" onClick={() => { setSaved(false); setEditing({ project }); }}
              className="rounded-lg border px-3 py-1 text-sm">ویرایش</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
