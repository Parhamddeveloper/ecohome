import { lazy, Suspense, useContext } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { LuArrowRight, LuBuilding2, LuCircleHelp, LuContact, LuFileText, LuLayoutGrid, LuUsers } from "react-icons/lu";
import { SessionContext } from "../../context/SessionContext";
import BtnToggleTheme from "../../components/Header/BtnToggleTheme";
import OurTeam from "../about-us/components/OurTeam/OurTeam";
import AccordionSect from "../faq/components/AccordionSect";
import AccountManagement from "./AccountManagement";
const ProjectManagement = lazy(() => import("./ProjectManagement"));

const sections = [
  { id: "faq", title: "سؤالات متداول", description: "افزودن، ویرایش و حذف سؤال و پاسخ", icon: LuCircleHelp, Panel: AccordionSect },
  { id: "projects", title: "پروژه‌ها", description: "افزودن و ویرایش پروژه، توضیحات و گالری تصاویر", icon: LuBuilding2, Panel: ProjectManagement },
  { id: "weblogs", title: "مقاله‌ها", description: "افزودن و ویرایش مقاله و تصاویر", icon: LuFileText, Panel: ProjectManagement },
  { id: "team", title: "اعضای تیم", description: "ویرایش اطلاعات، عکس و ترتیب نمایش اعضا", icon: LuUsers, Panel: OurTeam },
  { id: "accounts", title: "حساب‌های کاربری", description: "مشاهدهٔ حساب‌ها و مدیریت نقش مدیران", icon: LuContact, Panel: AccountManagement },
];

export default function Dashboard() {
  const { user, loading, sessionError } = useContext(SessionContext);
  const [params] = useSearchParams();
  if (loading) return <p role="status" className="p-8 text-center font-estedad">در حال بررسی نشست…</p>;
  if (sessionError && !user) return <p role="alert" className="p-8 text-center font-estedad">{sessionError}</p>;
  if (!user) return <Navigate to="/account" replace />;
  if (!["admin", "superadmin"].includes(user.role)) {
    return <section dir="rtl" className="p-8 text-center font-estedad">به داشبورد مدیریت دسترسی نداری. <Link className="underline" to="/account">بازگشت به حساب</Link></section>;
  }

  const available = user.role === "superadmin" ? sections : sections.slice(0, 3);
  const active = available.find((section) => section.id === params.get("section")) ?? available[0];
  const { Panel, icon: SectionIcon } = active;

  return (
    <main dir="rtl" className="min-h-screen bg-[#fbf6f0] px-4 py-6 font-estedad text-[#282e22] dark:bg-gray-950 dark:text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4 rounded-2xl border border-[#d8dacf] bg-white p-4 dark:border-gray-700 dark:bg-gray-900 lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center gap-3 px-2 py-2 font-estedad-bold">
            <span className="grid size-10 place-items-center rounded-xl bg-[#596348] text-white"><LuLayoutGrid aria-hidden="true" /></span>
            داشبورد مدیریت
          </div>
          <nav aria-label="بخش‌های مدیریت" className="flex flex-wrap gap-2 lg:grid">
            {available.map(({ id, title, icon: Icon }) => (
              <Link key={id} to={`?section=${id}`} aria-current={active.id === id ? "page" : undefined}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${active.id === id
                  ? "border-[#596348] bg-[#596348] font-estedad-bold text-white dark:border-[#c4ceb8] dark:bg-[#c4ceb8] dark:text-[#283020]"
                  : "border-transparent hover:bg-[#869074]/15"}`}>
                <Icon aria-hidden="true" className="size-4" /> {title}
              </Link>
            ))}
          </nav>
          <Link to="/account" className="flex items-center gap-2 border-t border-stone-200 px-2 pt-4 text-sm dark:border-gray-700">
            <LuArrowRight aria-hidden="true" /> بازگشت به حساب
          </Link>
        </aside>
        <div className="grid content-start gap-5">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#47533b] px-5 py-5 text-white sm:px-7">
            <div>
              <p className="text-sm text-[#e0e7d7]">{user.role === "superadmin" ? "مدیرکل" : "مدیر"}</p>
              <h1 className="mt-1 text-xl font-estedad-bold sm:text-2xl">{user.name}</h1>
            </div>
            <BtnToggleTheme />
          </header>
          <section aria-labelledby="dashboard-section" className="min-w-0 rounded-2xl border border-[#d8dacf] bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-6">
            <div className="mb-5 flex items-start gap-3 border-b border-stone-200 pb-4 dark:border-gray-700">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#869074]/20"><SectionIcon aria-hidden="true" /></span>
              <div>
                <h2 id="dashboard-section" className="text-xl font-estedad-bold">{active.title}</h2>
                <p className="mt-1 text-sm text-stone-600 dark:text-gray-300">{active.description}</p>
              </div>
            </div>
            <Suspense fallback={<p role="status">در حال بارگذاری بخش مدیریت…</p>}>
              <Panel key={active.id} embedded article={active.id === "weblogs"} />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  );
}
