import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { projects } from "../../../../../data/db";
import { motion } from "framer-motion";

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

export default function FilterSect() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <>
      <div className="flex px-3 gap-x-3 font-estedad lg:hidden">
        <button className="w-2/6 rounded-lg bg-[#6d74623a] flex justify-center items-center gap-x-2">
          فیلتر ها <IoFilter />
        </button>
        <div className="w-4/5 relative flex items-center">
          <BiSearch className="text-xl absolute right-4 rotate-90 opacity-50" />
          <input
            className="w-full rounded-lg focus:outline-0 border p-2 ps-10"
            type="text"
            placeholder="جستجوی مقالات"
          />
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="w-max my-2 lg:w-full flex lg:justify-center gap-3 rounded-full p-2 mx-auto transition-colors duration-500">
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
    </>
  );
}
