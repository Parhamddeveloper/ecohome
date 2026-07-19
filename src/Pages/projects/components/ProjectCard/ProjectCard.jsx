import { HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export default function ProjectCard() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#fbf6f0] dark:bg-gray-600 dark:text-white rounded-2xl overflow-hidden font-estedad transition-colors duration-500 shadow-2xl"
    >
      <div className="relative h-52">
        <div className="absolute bg-[#fbf6f0] dark:bg-gray-600 dark:text-white  right-5 top-5 px-4 py-2 rounded-2xl transition-colors duration-500">
          تجاری
        </div>
        <img
          src="/hero.webp"
          alt="Project image"
          className="object-cover h-full w-full"
        />
      </div>
      <div className="h-28 py-2 px-4 flex flex-col justify-between gap-y-2">
        <div>
          <h2 className="font-estedad-bold-extra">استودیو سبز</h2>
          <p className="text-sm font-estedad-light h-10">
            لورم ایپسوم یک متن محتوایی است که با استفاده از کلماتی بی معنی
            میتواند
          </p>
        </div>
        <Link className="text-sm flex items-center gap-x-1">
          دیدن پروژه <HiArrowLeft className="text-sm" />
        </Link>
      </div>
    </motion.div>
  );
}
