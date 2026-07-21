import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { LuSlidersHorizontal } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import FilterOffcanvas from "./FilterOffcanvas";

export const categories = [
  {
    id: "all",
    title: "همه پروژه‌ها",
  },
  {
    id: "residential",
    title: "مسکونی",
  },
  {
    id: "commercial",
    title: "تجاری",
  },
  {
    id: "renovation",
    title: "بازسازی",
  },
  {
    id: "interior",
    title: "طراحی داخلی",
  },
  {
    id: "eco",
    title: "طراحی پایدار",
  },
];

export default function MobileFilterSect({selectedCategory,setSelectedCategory,searchTerm,setSearchTerm}) {
  const [isOffcanvasOpen, setIsOffCanvasOpen] = useState(false);
  return (
    <>
      <AnimatePresence>
        {isOffcanvasOpen && (
          <FilterOffcanvas setIsOffCanvasOpen={setIsOffCanvasOpen} setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />
        )}
      </AnimatePresence>
      <div className="flex flex-col mt-4 px-3 gap-x-3 font-estedad lg:hidden">
        <div className="flex gap-x-4">
          <button
            className="flex-1 rounded-lg bg-[#6d74623a] flex justify-center items-center gap-x-2"
            onClick={() => setIsOffCanvasOpen(true)}
          >
            <span className="hidden sm:inline">فیلتر ها</span>
            <LuSlidersHorizontal />
          </button>
          <div className="w-4/5 relative flex items-center">
            <BiSearch className="text-xl absolute right-4 rotate-90 opacity-50" />
            <input
              className="w-full rounded-lg focus:outline-0 border p-2 ps-10 placeholder:dark:text-white/45"
              type="text"
              placeholder="جستجوی مقالات"
              value={searchTerm}
              onChange={(e)=> setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="w-max my-2 lg:w-full flex lg:justify-center gap-3 rounded-full py-2 mx-auto transition-colors duration-500">
            {categories.map((item) => {
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setSelectedCategory(item.id)}
                  className={`
                  relative
                  flex
                  items-center
                  justify-center
                  border
                  gap-2
                  px-6
                  py-3
                  rounded-full
                  whitespace-nowrap
                  shrink-0
                  cursor-pointer
                  ${selectedCategory == item.id && "bg-[#869074] text-white dark:bg-emerald-700"}
                  transition-colors
                  dark:text-white
                  `}
                >
                  <span className="relative z-10 font-estedad-light">
                    {item.title}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
