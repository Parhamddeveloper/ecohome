import ProjectCard from "../ProjectCard/ProjectCard";
import { useState } from "react";
import { HiOutlineSquares2X2, HiOutlineHome } from "react-icons/hi2";
import { MdOutlineChair } from "react-icons/md";
import { TbBuilding } from "react-icons/tb";
import { LuHammer } from "react-icons/lu";
import { PiLeaf } from "react-icons/pi";
import { motion } from "framer-motion";
import { projects } from "../../../../../data/db";

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
  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.type === selectedCategory);
  return (
    <section className=" transition-colors duration-500">
      <div className="max-w-7xl mx-auto py-8 px-3 xl:px-0">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="w-max my-2 lg:w-full flex lg:justify-center gap-3 bg-white dark:bg-gray-700 rounded-full shadow-md p-2 mx-auto transition-colors duration-500">
            {categories.map((item) => {
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

                  <item.icon className="relative z-10 text-xl" />

                  <span className="relative z-10 font-estedad-light">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h2 className="text-2xl font-estedad dark:text-white">
                پروژه‌ای در این دسته ‌بندی یافت نشد.
              </h2>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
