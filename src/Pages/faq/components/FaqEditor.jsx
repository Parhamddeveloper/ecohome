import { useState } from "react";

export default function FaqEditor({ faq, onSave, onCancel }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const question = form.get("question").trim();
    const answer = form.get("answer").trim();
    if (!question || !answer) {
      setError("سؤال و پاسخ را وارد کن.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const response = await fetch(faq ? `/api/faqs?id=${faq.id}` : "/api/faqs", {
        method: faq ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      if (response.status === 401) {
        setError("نشست ورود معتبر نیست. صفحه را تازه‌سازی کن و دوباره تلاش کن.");
        return;
      }
      if (response.status === 403) {
        setError("برای ویرایش با حساب مدیر وارد شو.");
        return;
      }
      if (!response.ok) throw new Error();
      onSave(await response.json());
    } catch {
      setError("ذخیره انجام نشد. دوباره تلاش کن.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl border border-gray-400 p-4 font-estedad dark:text-white">
      <label className="grid gap-1">
        سؤال
        <input name="question" defaultValue={faq?.question} maxLength={300} required disabled={pending}
          className="rounded-lg border border-gray-400 px-3 py-2" />
      </label>
      <label className="grid gap-1">
        پاسخ
        <textarea name="answer" defaultValue={faq?.answer} maxLength={5000} rows={5} required disabled={pending}
          className="rounded-lg border border-gray-400 px-3 py-2" />
      </label>
      {error && <p role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button disabled={pending} className="rounded-lg bg-[#596348] px-4 py-2 text-white disabled:opacity-60">
          {pending ? "در حال ذخیره…" : "ذخیره"}
        </button>
        <button type="button" onClick={onCancel} disabled={pending} className="rounded-lg border px-4 py-2">
          انصراف
        </button>
      </div>
    </form>
  );
}
