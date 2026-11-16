import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "../../context/SessionContext";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function Account() {
  const { user, setUser, loading, sessionError } = useContext(SessionContext);
  const [mode, setMode] = useState("login");
  const [submitting, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [isPasswordHide, setIsPasswordHide] = useState(true);
  const pending = loading || submitting;
  const message = error ?? sessionError;

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
  return (
    <section
      className="mx-auto max-w-md px-4 py-12 font-estedad dark:text-white"
      dir="rtl"
    >
      <h1 className="mb-6 text-2xl font-estedad-bold">
        {user ? "حساب کاربری" : registering ? "ثبت‌ نام" : "ورود"}
      </h1>
      {user ? (
        <div className="flex flex-col gap-4">
          <p>{user.name}</p>
          <p dir="ltr" className="text-right">
            {user.email}
          </p>
          {["admin", "superadmin"].includes(user.role) && (
            <Link
              to="/dashboard"
              className="rounded-lg border border-[#869074] p-2 text-center"
            >
              داشبورد مدیریت
            </Link>
          )}
          <Link
            to="/edit-profile"
            className="rounded-lg bg-[#596348] p-2 text-center text-white"
          >
            ویرایش اطلاعات
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={logout}
            className="rounded-lg border p-2"
          >
            خروج از حساب
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          {registering && (
            <label className="grid gap-1">
              نام
              <input
                name="name"
                autoComplete="name"
                minLength={3}
                maxLength={80}
                required
                className={"w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 outline-none"}
              />
            </label>
          )}
          <label className="grid gap-1">
            ایمیل
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              dir="ltr"
              className={"w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 focus:outline-none"}
            />
          </label>
          <div className="grid gap-1">
            <label htmlFor="password">رمز عبور</label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={isPasswordHide ? "password" : "text"}
                autoComplete={registering ? "new-password" : "current-password"}
                minLength={8}
                maxLength={128}
                required
                dir="ltr"
                className={`${"w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 focus:outline-none"} w-full pr-12`}
              />

              <button
                type="button"
                onClick={() => setIsPasswordHide((prev) => !prev)}
                aria-label={
                  isPasswordHide ? "نمایش رمز عبور" : "پنهان کردن رمز عبور"
                }
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center"
              >
                {isPasswordHide ? (
                  <FaEyeSlash aria-hidden="true" />
                ) : (
                  <FaEye aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <button
            disabled={pending}
            className="rounded-lg transition-colors bg-[#869074] hover:bg-[#596348] p-2 text-white disabled:opacity-60"
          >
            {pending ? "در حال بررسی…" : registering ? "ثبت‌ نام" : "ورود"}
          </button>
          <button
            type="button"
            className="text-blue-600 dark:text-blue-200 dark:hover:text-blue-300 hover:text-blue-500 cursor-pointer"
            disabled={pending}
            onClick={() => {
              setError("");
              setMode(registering ? "login" : "register");
            }}
          >
            {registering
              ? "حساب دارم، اکنون وارد می‌شوم"
              : "حساب ندارم، اکنون عضو میشوم"}
          </button>
        </form>
      )}
      {message && (
        <p role="alert" className="mt-4 text-red-700 dark:text-red-300">
          {message}
        </p>
      )}
    </section>
  );
}
