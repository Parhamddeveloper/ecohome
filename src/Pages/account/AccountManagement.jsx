import { useEffect, useState } from "react";

const roleNames = { user: "کاربر", admin: "مدیر", superadmin: "مدیرکل" };

export default function AccountManagement() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/admin-users?page=${page}`, { signal: controller.signal });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!controller.signal.aborted) setResult({ page, ...data });
      } catch {
        if (!controller.signal.aborted) setResult({ page, error: "بارگذاری حساب‌ها انجام نشد." });
      }
    }
    load();
    return () => controller.abort();
  }, [page, reload]);

  async function deleteAccount(account) {
    setPending(account.id);
    setFeedback(null);
    try {
      const query = new URLSearchParams({ id: account.id });
      const response = await fetch(`/api/admin-users?${query}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setConfirmId(null);
      setResult(null);
      if (result.accounts.length === 1 && page > 1 && !result.hasNext) setPage(page - 1);
      else setReload((current) => current + 1);
      setFeedback({ text: "حساب حذف شد." });
    } catch {
      setFeedback({ error: true, text: "حذف حساب انجام نشد." });
    } finally {
      setPending(null);
    }
  }

  async function changeRole(account, role) {
    setFeedback(null);
    setPending(account.id);
    try {
      const response = await fetch("/api/admin-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: account.id, role }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFeedback({ error: true, text: data.error });
        return;
      }
      setResult((current) => ({
        ...current,
        accounts: current.accounts.map((item) => item.id === data.id ? data : item),
      }));
      setFeedback({ text: "نقش حساب ذخیره شد." });
    } catch {
      setFeedback({ error: true, text: "ذخیرهٔ نقش انجام نشد." });
    } finally {
      setPending(null);
    }
  }

  if (result?.page !== page) return <p role="status">در حال بارگذاری حساب‌ها…</p>;
  if (result.error) return <p role="alert">{result.error}</p>;

  return (
    <div className="grid gap-4">
      {feedback && <p role={feedback.error ? "alert" : "status"} className="text-sm">{feedback.text}</p>}
      {result.accounts.length === 0 ? <p>حسابی برای نمایش وجود ندارد.</p> : (
        <ul className="divide-y divide-stone-200 overflow-hidden rounded-xl border border-stone-200 dark:divide-gray-700 dark:border-gray-700">
          {result.accounts.map((account) => (
            <li key={account.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
              <div className="min-w-0">
                <p className="font-estedad-bold">{account.name}</p>
                <p dir="ltr" className="break-all text-sm text-stone-600 dark:text-gray-300">{account.email}</p>
              </div>
              {["user", "admin"].includes(account.role) ? (
                <div className="flex flex-wrap items-center gap-2">
                {confirmId === account.id ? (
                  <>
                    <span className="text-sm">حساب برای همیشه حذف شود؟</span>
                    <button type="button" disabled={pending !== null} onClick={() => deleteAccount(account)}
                      className="rounded-lg bg-red-700 px-3 py-2 text-sm text-white disabled:opacity-50">تأیید حذف</button>
                    <button type="button" disabled={pending !== null} onClick={() => setConfirmId(null)}
                      className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">انصراف</button>
                  </>
                ) : (
                  <>
                <select value={account.role} disabled={pending !== null} aria-label={`نقش ${account.name} (${account.email})`}
                  onChange={(event) => changeRole(account, event.target.value)}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800">
                  <option value="user">کاربر</option>
                  <option value="admin">مدیر</option>
                </select>
                    <button type="button" disabled={pending !== null} onClick={() => {
                      setFeedback(null);
                      setConfirmId(account.id);
                    }} aria-label={`حذف حساب ${account.name}`}
                      className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-800 disabled:opacity-50 dark:text-red-200">حذف</button>
                  </>
                )}
                </div>
              ) : (
                <span className="rounded-full bg-[#869074]/20 px-3 py-1 text-sm">{roleNames[account.role] ?? account.role}</span>
              )}
            </li>
          ))}
        </ul>
      )}
      {(page > 1 || result.hasNext) && (
        <nav aria-label="صفحه‌بندی حساب‌ها" className="flex items-center gap-3 text-sm">
          <button type="button" disabled={page === 1 || pending !== null} onClick={() => { setFeedback(null); setPage(page - 1); }} className="rounded-lg border px-3 py-1 disabled:opacity-40">قبلی</button>
          <span>صفحهٔ {page.toLocaleString("fa-IR")}</span>
          <button type="button" disabled={!result.hasNext || pending !== null} onClick={() => { setFeedback(null); setPage(page + 1); }} className="rounded-lg border px-3 py-1 disabled:opacity-40">بعدی</button>
        </nav>
      )}
    </div>
  );
}
