import { BiSearch } from "react-icons/bi";
import { PopularTags } from "../../../../../data/db";
import RecentBlogsCart from "../recentBlogsCart/RecentBlogsCart";
export default function FilterSect({
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  weblogs,
}) {
  const recentPosts = weblogs.slice(-3).reverse();

  return (
    <div className="flex flex-col gap-y-4 transition-colors duration-500">
      <div className="bg-gray-300/35 rounded-xl p-3 font-estedad">
        <h2>جستجوی وبلاگ</h2>
        <div className="relative flex items-center mt-3 w-full">
          <BiSearch className="text-xl absolute right-4 rotate-90 opacity-50 dark:text-black/55" />
          <input
            className="w-full rounded-lg bg-white focus:outline-0 border border-gray-400 p-2 ps-10 text-black placeholder:text-black/45 placeholder:dark:text-white/45"
            type="text"
            aria-describedby="weblog-search-limit"
            placeholder="جستجوی مقالات"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-gray-300/35 rounded-xl p-3 font-estedad">
        <h2>دسته بندی ها</h2>
        {categories.map((Item) => (
          <button
            key={Item.id}
            className={`flex justify-between w-full my-3 p-1 px-2 cursor-pointer ${selectedCategory == Item.id && "rounded-lg bg-[#869074] text-white"}`}
            onClick={() => setSelectedCategory(Item.id)}
          >
            <span>{Item.title}</span>
            <span
              className={`flex items-center justify-center  ${selectedCategory == Item.id ? "bg-green-200/15" : "bg-red-200 text-emerald-800"} py-0.5 px-2 rounded-full `}
            >
              {Item.count}
            </span>
          </button>
        ))}
      </div>
      <div className="bg-gray-300/35 rounded-xl p-3 font-estedad">
        <h2>پست های اخیر</h2>
        <div className="flex flex-col gap-y-3 mt-3">
          {recentPosts.map((Item) => (
            <RecentBlogsCart key={Item.id} {...Item} />
          ))}
        </div>
      </div>
      <div className="bg-gray-300/35 rounded-xl p-3 font-estedad">
        <h2>تگ های معروف</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {PopularTags.map((Tag) => (
            <button
              key={Tag.id}
              onClick={() => setSearchTerm(Tag.tag_name)}
              className="text-sm cursor-pointer bg-red-200/55 dark:bg-red-200 text-emerald-900 p-1 px-3 rounded-2xl transition-colors duration-500"
            >
              {Tag.tag_name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
