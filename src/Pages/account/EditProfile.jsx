import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { SessionContext } from "../../context/SessionContext";

const inputClass = "w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2";

export default function EditProfile() {
  const { user, setUser, loading, sessionError } = useContext(SessionContext);
  const [newPassword, setNewPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setSaved(false);
    if (fields.newPassword !== fields.confirmPassword) {
      setError("رمز جدید و تکرار آن یکسان نیستند.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error);
        return;
      }
      form.reset();
      setNewPassword("");
      setUser(result.user);
      setSaved(true);
    } catch {
      setError("ذخیرهٔ اطلاعات حساب انجام نشد.");
    } finally {
      setPending(false);
    }
  }

  if (loading) return <p role="status" className="p-8 text-center">در حال بررسی نشست…</p>;
  if (sessionError && !user) return <p role="alert" className="p-8 text-center">{sessionError}</p>;
  if (!user) return <Navigate to="/account" replace />;

  return (
    <section className="mx-auto max-w-md px-4 py-12 font-estedad dark:text-white" dir="rtl">
      <h1 className="mb-6 text-2xl font-estedad-bold">ویرایش اطلاعات</h1>
      <form key={JSON.stringify([user.name, user.email])} onSubmit={submit}
        onChange={() => setSaved(false)} className="grid gap-4">
        <label className="grid gap-1">
          نام نمایشی
          <input name="name" defaultValue={user.name} autoComplete="name" minLength={3}
            maxLength={80} required disabled={pending} className={inputClass} />
        </label>
        <label className="grid gap-1">
          ایمیل
          <input name="email" defaultValue={user.email} type="email" autoComplete="email"
            maxLength={254} required disabled={pending} dir="ltr" className={inputClass} />
        </label>
        <fieldset className="grid gap-3 rounded-lg border border-gray-400 p-4" disabled={pending}>
          <legend className="px-2">تغییر رمز عبور</legend>
          <p className="text-sm">اگر رمز جدید را خالی بگذاری، رمز فعلی حفظ می‌شود.</p>
          <label className="grid gap-1">
            رمز عبور فعلی
            <input name="currentPassword" type="password" autoComplete="current-password"
              required={Boolean(newPassword)} maxLength={128} dir="ltr" className={inputClass} />
          </label>
          <label className="grid gap-1">
            رمز عبور جدید
            <input name="newPassword" type="password" autoComplete="new-password"
              value={newPassword} onChange={(event) => setNewPassword(event.target.value)}
              minLength={8} maxLength={128} dir="ltr" className={inputClass} />
          </label>
          <label className="grid gap-1">
            تکرار رمز عبور جدید
            <input name="confirmPassword" type="password" autoComplete="new-password"
              required={Boolean(newPassword)} maxLength={128} dir="ltr" className={inputClass} />
          </label>
        </fieldset>
        {error && <p role="alert" className="text-red-700 dark:text-red-300">{error}</p>}
        {saved && <p role="status">اطلاعات حساب ذخیره شد.</p>}
        <button disabled={pending} className="rounded-lg bg-[#596348] p-2 text-white disabled:opacity-60">
          {pending ? "در حال ذخیره…" : "ذخیرهٔ تغییرات"}
        </button>
        <Link to="/account" className="text-center">بازگشت به حساب کاربری</Link>
      </form>
    </section>
  );
}
