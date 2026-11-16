import { useEffect, useState } from "react";

export default function Account() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadSession() {
      try {
        const response = await fetch("/api/auth", { signal: controller.signal });
        if (!response.ok) throw new Error();
        const { user } = await response.json();
        if (!controller.signal.aborted) setUser(user);
      } catch {
        if (!controller.signal.aborted) setError("بررسی وضعیت ورود انجام نشد.");
      } finally {
        if (!controller.signal.aborted) setPending(false);
      }
    }

    loadSession();
    return () => controller.abort();
  }, []);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          email: form.get("email"),
          password: form.get("password"),
          name: form.get("name"),
        }),
      });
      const result = await response.json();
      if (response.ok) setUser(result.user);
      else setError(result.error);
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth", { method: "DELETE" });
      if (!response.ok) throw new Error();
      setUser(null);
    } catch {
      setError("خروج از حساب انجام نشد.");
    } finally {
      setPending(false);
    }
  }

  const registering = mode === "register";
  const inputClass = "w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2";

  return (
    <section className="mx-auto max-w-md px-4 py-12 font-estedad dark:text-white" dir="rtl">
      <h1 className="mb-6 text-2xl font-estedad-bold">
        {user ? "حساب کاربری" : registering ? "ثبت‌نام" : "ورود"}
      </h1>
      {user ? (
        <div className="flex flex-col gap-4">
          <p>{user.name}</p>
          <p dir="ltr" className="text-right">{user.email}</p>
          <button type="button" disabled={pending} onClick={logout} className="rounded-lg border p-2">
            خروج از حساب
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          {registering && (
            <label className="grid gap-1">
              نام
              <input name="name" autoComplete="name" maxLength={80} required className={inputClass} />
            </label>
          )}
          <label className="grid gap-1">
            ایمیل
            <input name="email" type="email" autoComplete="email" maxLength={254} required dir="ltr" className={inputClass} />
          </label>
          <label className="grid gap-1">
            رمز عبور
            <input name="password" type="password" autoComplete={registering ? "new-password" : "current-password"} minLength={8} maxLength={128} required dir="ltr" className={inputClass} />
          </label>
          <button disabled={pending} className="rounded-lg bg-[#596348] p-2 text-white disabled:opacity-60">
            {pending ? "در حال بررسی…" : registering ? "ثبت‌نام" : "ورود"}
          </button>
          <button type="button" disabled={pending} onClick={() => {
            setError("");
            setMode(registering ? "login" : "register");
          }}>
            {registering ? "حساب دارم، وارد می‌شوم" : "حساب ندارم، ثبت‌نام می‌کنم"}
          </button>
        </form>
      )}
      {error && <p role="alert" className="mt-4 text-red-700 dark:text-red-300">{error}</p>}
    </section>
  );
}
