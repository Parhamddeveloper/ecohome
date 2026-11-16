import { useState } from "react";
import { TEAM_PHOTO_LIMIT, TEAM_PHOTO_LIMIT_LABEL } from "../../../../../data/team-photo.js";

const inputClass = "w-full rounded-lg border border-gray-400 px-3 py-2";

export default function TeamMemberEditor({ member, onSave, onCancel }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const photo = fields.get("photo");
    if (photo?.size > TEAM_PHOTO_LIMIT) {
      setError(`حجم تصویر باید حداکثر ${TEAM_PHOTO_LIMIT_LABEL} مگابایت باشد.`);
      return;
    }
    setPending(true);
    setError("");
    try {
      if (!photo?.size) fields.delete("photo");
      const response = await fetch(`/api/team-members?id=${member.id}`, {
        method: "PATCH",
        body: fields,
      });
      const result = await response.json();
      if (!response.ok) {
        setError(response.status === 401 || response.status === 403
          ? "ویرایش اعضای تیم فقط با حساب مدیرکل امکان‌پذیر است."
          : result.error);
        return;
      }
      onSave(result);
    } catch {
      setError("ذخیره انجام نشد. دوباره تلاش کن.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl border border-gray-400 p-4">
      <label className="grid gap-1">
        نام
        <input name="name" defaultValue={member.name} maxLength={100} required disabled={pending} className={inputClass} />
      </label>
      <label className="grid gap-1">
        سمت
        <input name="role" defaultValue={member.role} maxLength={120} required disabled={pending} className={inputClass} />
      </label>
      <label className="grid gap-1">
        عکس عضو
        <input name="photo" type="file" accept="image/png,image/jpeg,image/webp" disabled={pending} className={inputClass} />
        <span className="text-sm">PNG، JPEG یا WebP، حداکثر {TEAM_PHOTO_LIMIT_LABEL} مگابایت. بدون انتخاب فایل، عکس فعلی حفظ می‌شود.</span>
      </label>
      <label className="grid gap-1">
        توضیحات
        <textarea name="text" defaultValue={member.text} maxLength={2000} rows={4} required disabled={pending} className={inputClass} />
      </label>
      {error && <p role="alert">{error}</p>}
      <div className="flex gap-2">
        <button disabled={pending} className="rounded-lg bg-[#596348] px-4 py-2 text-white">
          {pending ? "در حال ذخیره…" : "ذخیره"}
        </button>
        <button type="button" onClick={onCancel} disabled={pending} className="rounded-lg border px-4 py-2">
          انصراف
        </button>
      </div>
    </form>
  );
}
