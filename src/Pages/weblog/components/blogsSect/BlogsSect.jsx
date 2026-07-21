import { useState } from "react";
import { weblogs } from "../../../../../data/db";
import BlogCart from "../blogCart/BlogCart";
import FilterOffcanvas from "../filterSect/FilterOffcanvas";
import MobileFilterSect from "../filterSect/MobileFilterSect";
import FilterSect from "../filterSect/FilterSect";

export default function BlogsSect() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredWeblogs = weblogs.filter((weblog) => {
    const matchesCategory =
      selectedCategory === "all" || weblog.type === selectedCategory;

    const text = `${weblog.title} ${weblog.text}`.toLowerCase();
    const matchesSearch = text.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });
  return (
    <section className="w-full">
      <MobileFilterSect
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className="py-5 max-w-7xl mx-auto grid lg:grid-cols-4 px-2 gap-x-8 items-start">
        <aside className="lg:grid col-span-1 hidden">
          <FilterSect
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </aside>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 lg:col-span-3">
          {filteredWeblogs.map((item) => (
            <BlogCart key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
