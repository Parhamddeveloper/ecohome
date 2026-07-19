import ProjectCard from "../ProjectCard/ProjectCard";
import { useState } from "react";
import { HiOutlineSquares2X2, HiOutlineHome } from "react-icons/hi2";
import { MdOutlineChair } from "react-icons/md";
import { TbBuilding } from "react-icons/tb";
import { LuHammer } from "react-icons/lu";
import { PiLeaf } from "react-icons/pi";
import { motion } from "framer-motion";

export const categories = [
  {
    id: "all",
    title: "همه پروژه‌ها",
    icon: HiOutlineSquares2X2,
  },
  {
    id: "residential",
    title: "مسکونی",
    icon: HiOutlineHome,
  },
  {
    id: "commercial",
    title: "تجاری",
    icon: TbBuilding,
  },
  {
    id: "renovation",
    title: "بازسازی",
    icon: LuHammer,
  },
  {
    id: "interior",
    title: "طراحی داخلی",
    icon: MdOutlineChair,
  },
  {
    id: "eco",
    title: "طراحی پایدار",
    icon: PiLeaf,
  },
];

export default function ProjectsSect() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <section className="bg-[#fbf6f0] dark:bg-gray-700 transition-colors duration-500">
      <div className="max-w-7xl mx-auto py-8 px-3 xl:px-0">

        {/* Filters */}

        <div className="overflow-x-auto scrollbar-hide">
          <div className="w-max lg:w-full flex lg:justify-center gap-3 bg-white dark:bg-gray-600 rounded-full shadow-md p-2 mx-auto">

            {categories.map((item) => {

              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedCategory(item.id)}
                  className="
                  relative
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  py-3
                  rounded-full
                  whitespace-nowrap
                  shrink-0
                  cursor-pointer
                  dark:text-white
                  "
                >
                  {selectedCategory === item.id && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 rounded-full bg-[#ECE6DE] dark:bg-gray-500 shadow-md"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon className="relative z-10 text-xl" />

                  <span className="relative z-10 font-estedad-light">
                    {item.title}
                  </span>

                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />

        </div>

      </div>
    </section>
  );
}