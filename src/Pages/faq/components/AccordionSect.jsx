import { useEffect, useState } from "react";
import Accordion from "../../../components/accordion/Accordion";

export default function AccordionSect() {
  const [catalog, setCatalog] = useState({ status: "loading", faqs: [] });
  const { status, faqs } = catalog;

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

  return (
    <section className="bg-[#fbf6f0] dark:bg-gray-500 py-4 transition-colors duration-500">
        <h1 className="text-center text-2xl font-estedad-extra-bold dark:text-white">سوالات متداول</h1>
      <div className="flex flex-col gap-y-4 max-w-7xl mx-auto mt-7">
        {status === "loading" && <p role="status" className="text-center dark:text-white">در حال بارگذاری سؤال‌ها…</p>}
        {status === "error" && <p role="alert" className="text-center dark:text-white">بارگذاری سؤال‌ها انجام نشد.</p>}
        {status === "ready" && faqs.length === 0 && <p className="text-center dark:text-white">سؤالی برای نمایش وجود ندارد.</p>}
        {faqs.map((faq) => (
          <Accordion key={faq.id} {...faq} />
        ))}
      </div>
    </section>
  );
}
