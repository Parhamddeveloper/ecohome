import { useEffect, useState } from "react";
import BlogCart from "../blogCart/BlogCart";
import MobileFilterSect from "../filterSect/MobileFilterSect";
import FilterSect from "../filterSect/FilterSect";
import { WEBLOG_SEARCH_LIMIT } from "../../../../../data/weblog-search.js";

const weblogCategories = [
  { id: "all", title: "همه مقالات" },
  { id: "residential", title: "مسکونی" },
  { id: "commercial", title: "تجاری" },
  { id: "renovation", title: "بازسازی" },
  { id: "interior", title: "طراحی داخلی" },
  { id: "eco", title: "طراحی پایدار" },
];

const loadingCatalog = { status: "loading", weblogs: [] };

function useWeblogs(url, delay = 0) {
  const [catalog, setCatalog] = useState(null);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();

    async function loadWeblogs() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load weblogs");
        const weblogs = await response.json();
        if (!controller.signal.aborted) setCatalog({ url, status: "ready", weblogs });
      } catch {
        if (!controller.signal.aborted) setCatalog({ url, status: "error", weblogs: [] });
      }
    }

    const timer = setTimeout(loadWeblogs, delay);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [url, delay]);

  return catalog?.url === url ? catalog : loadingCatalog;
}

export default function BlogsSect() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const searchTooLong = searchTerm.length > WEBLOG_SEARCH_LIMIT;
  const search = searchTerm.trim();
  const params = new URLSearchParams();
  if (selectedCategory !== "all") params.set("type", selectedCategory);
  if (search) params.set("q", search);

  const catalog = useWeblogs("/api/weblogs");
  const filterUrl = !searchTooLong && params.size ? `/api/weblogs?${params}` : null;
  const filteredCatalog = useWeblogs(filterUrl, search ? 300 : 0);
  const { status, weblogs } = filterUrl ? filteredCatalog : catalog;
  const categories = weblogCategories.map((category) => ({
    ...category,
    count: catalog.status === "ready"
      ? catalog.weblogs.filter((weblog) => category.id === "all" || weblog.type === category.id).length
      : "—",
  }));
  return (
    <section className="w-full">
      <MobileFilterSect
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="py-5 max-w-7xl mx-auto grid lg:grid-cols-4 px-2 gap-x-8 items-start">
        <aside className="lg:grid col-span-1 hidden">
          <FilterSect
            categories={categories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            weblogs={catalog.weblogs}
          />
        </aside>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 lg:col-span-3">
          {searchTooLong ? (
            <p role="alert" className="col-span-full text-center py-10">
              متن جست‌وجو را به حداکثر {WEBLOG_SEARCH_LIMIT.toLocaleString("fa-IR")} کاراکتر کوتاه کنید.
            </p>
          ) : status === "loading" ? (
            <p role="status" className="col-span-full text-center py-10">
              در حال بارگذاری مقالات…
            </p>
          ) : status === "error" ? (
            <p role="alert" className="col-span-full text-center py-10">
              بارگذاری مقالات انجام نشد. لطفاً صفحه را دوباره باز کنید.
            </p>
          ) : weblogs.length === 0 ? (
            <p className="col-span-full text-center py-10">مقاله‌ای یافت نشد.</p>
          ) : weblogs.map((item) => <BlogCart key={item.id} {...item} />)}
        </div>
      </div>
    </section>
  );
}
