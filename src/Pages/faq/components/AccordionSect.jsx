import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { SessionContext } from "../../../context/SessionContext";
import Accordion from "../../../components/accordion/Accordion";
import FaqEditor from "./FaqEditor";
const SortableOrder = lazy(() => import("../../../components/SortableOrder"));

export default function AccordionSect({ embedded = false }) {
  const [catalog, setCatalog] = useState({ status: "loading", faqs: [] });
  const { status, faqs } = catalog;
  const { user } = useContext(SessionContext);
  const canEdit = embedded && ["admin", "superadmin"].includes(user?.role);
  const [action, setAction] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const sorting = canEdit && action?.mode === "sort";

  useEffect(() => {
    const controller = new AbortController();

    async function loadFaqs() {
      try {
        const response = await fetch("/api/faqs", { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load FAQs");
        const faqs = await response.json();
        if (!controller.signal.aborted) setCatalog({ status: "ready", faqs });
      } catch {
        if (!controller.signal.aborted) setCatalog({ status: "error", faqs: [] });
      }
    }

    loadFaqs();
    return () => controller.abort();
  }, []);

  function saveFaq(updatedFaq) {
    setCatalog((current) => ({
      ...current,
      faqs: action.mode === "create"
        ? [...current.faqs, updatedFaq]
        : current.faqs.map((faq) => faq.id === updatedFaq.id ? updatedFaq : faq),
    }));
    setAction(null);
    setMessage(action.mode === "create" ? "سؤال اضافه شد." : "تغییرات ذخیره شد.");
  }

  function openAction(mode, id) {
    setMessage("");
    setError("");
    setAction({ mode, id });
  }

  async function deleteFaq(id) {
    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      setCatalog((current) => ({
        ...current,
        faqs: current.faqs.filter((faq) => faq.id !== id),
      }));
      setAction(null);
      setMessage("سؤال حذف شد.");
    } catch {
      setError("حذف سؤال انجام نشد. دوباره تلاش کن.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className={embedded ? "" : "bg-[#fbf6f0] dark:bg-gray-500 py-4 transition-colors duration-500"}>
      {!embedded && <h1 className="text-center text-2xl font-estedad-extra-bold dark:text-white">سوالات متداول</h1>}
      <div className={`flex flex-col gap-y-4 ${embedded ? "" : "max-w-7xl mx-auto mt-7 px-3"}`}>
        {message && <p role="status" className="font-estedad dark:text-white">{message}</p>}
        {error && <p role="alert" className="font-estedad dark:text-white">{error}</p>}
        {canEdit && status === "ready" && action === null && (
          <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => openAction("create")} className="self-start rounded-lg bg-[#596348] px-4 py-2 font-estedad text-white">
            افزودن سؤال
          </button>
          {faqs.length > 1 && (
            <button type="button" onClick={() => openAction("sort")} className="rounded-lg border px-4 py-2">
              مرتب‌سازی سؤال‌ها
            </button>
          )}
          </div>
        )}
        {sorting && (
          <Suspense fallback={<p role="status">در حال بارگذاری مرتب‌سازی…</p>}>
            <SortableOrder items={faqs.map((faq) => ({ ...faq, name: faq.question }))}
              endpoint="/api/faqs" onSave={(ordered) => {
                const byId = new Map(faqs.map((faq) => [faq.id, faq]));
                setCatalog({ status: "ready", faqs: ordered.map(({ id }) => byId.get(id)) });
                setAction(null);
                setMessage("ترتیب سؤال‌ها ذخیره شد.");
              }} />
            <button type="button" onClick={() => setAction(null)} className="self-start rounded-lg border px-4 py-2">
              بازگشت به سؤال‌ها
            </button>
          </Suspense>
        )}
        {canEdit && action?.mode === "create" && (
          <FaqEditor onSave={saveFaq} onCancel={() => setAction(null)} />
        )}
        {status === "loading" && <p role="status" className="text-center dark:text-white">در حال بارگذاری سؤال‌ها…</p>}
        {status === "error" && <p role="alert" className="text-center dark:text-white">بارگذاری سؤال‌ها انجام نشد.</p>}
        {status === "ready" && faqs.length === 0 && <p className="text-center dark:text-white">سؤالی برای نمایش وجود ندارد.</p>}
        {!sorting && faqs.map((faq) => (
          <div key={faq.id} className="grid gap-2">
            <Accordion {...faq} />
            {canEdit && action?.mode === "edit" && action.id === faq.id && (
              <FaqEditor faq={faq} onSave={saveFaq} onCancel={() => setAction(null)} />
            )}
            {canEdit && action?.mode === "delete" && action.id === faq.id && (
              <div className="flex flex-wrap items-center gap-2 font-estedad dark:text-white">
                <p>این سؤال حذف شود؟</p>
                <button type="button" disabled={deleting} onClick={() => deleteFaq(faq.id)} className="rounded-lg bg-red-700 px-3 py-1 text-white">
                  {deleting ? "در حال حذف…" : "تأیید حذف"}
                </button>
                <button type="button" disabled={deleting} onClick={() => setAction(null)} className="rounded-lg border px-3 py-1">
                  انصراف
                </button>
              </div>
            )}
            {canEdit && action === null && (
              <div className="flex gap-2 font-estedad dark:text-white">
                <button type="button" onClick={() => openAction("edit", faq.id)} className="rounded-lg border px-3 py-1">
                  ویرایش سؤال
                </button>
                <button type="button" onClick={() => openAction("delete", faq.id)} className="rounded-lg border px-3 py-1">
                  حذف سؤال
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
