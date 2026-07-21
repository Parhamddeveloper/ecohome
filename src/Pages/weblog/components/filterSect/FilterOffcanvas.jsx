import { useEffect } from "react";
import { motion } from "framer-motion";
export const categories = [
  {
    id: "all",
    title: "همه پروژه‌ها",
    count: 3,
  },
  {
    id: "residential",
    title: "مسکونی",
    count: 6,
  },
  {
    id: "commercial",
    title: "تجاری",
    count: 5,
  },
  {
    id: "renovation",
    title: "بازسازی",
    count: 12,
  },
  {
    id: "interior",
    title: "طراحی داخلی",
    count: 11,
  },
  {
    id: "eco",
    title: "طراحی پایدار",
    count: 21,
  },
];

export default function FilterOffcanvas({ setIsOffCanvasOpen,setSelectedCategory,selectedCategory }) {
  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden");

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, []);

  const FilterHandler = (id)=>{
    setSelectedCategory(id)
    setIsOffCanvasOpen(false)
  }

  const clearFilterHandler = ()=>{
    setSelectedCategory("all")
    setIsOffCanvasOpen(false)
  }
  return (
    <div className="fixed inset-0 z-40">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-black/45 inset-0 absolute"
        onClick={() => setIsOffCanvasOpen(false)}
      ></motion.div>
      <motion.div
        initial={{ y: 600 }}
        animate={{ y:0 }}
        exit={{y: 600}}
        transition={{ duration: 0.2 }}
        className="flex flex-col h-[70vh] w-full rounded-t-4xl bg-[#e0dbd5] dark:bg-gray-800 dark:text-white absolute bottom-0 right-0 p-4 font-estedad "
      >
        <h2 className="text-center text-xl">دسته بندی ها</h2>
        <div className="mt-6">
          {categories.map((Item) => (
            <div className={`flex justify-between my-3 p-1 px-2 ${selectedCategory == Item.id && "rounded-lg bg-[#869074] text-white"}`} onClick={() => FilterHandler(Item.id)}>
              <span>{Item.title}</span>
              <span className={`flex items-center justify-center  ${selectedCategory == Item.id ? "bg-green-200/15" : "bg-red-200 text-emerald-800"} py-0.5 px-2 rounded-full `}>
                {Item.count}
              </span>
            </div>
          ))}
        </div>
        <div className="mx-auto w-full flex justify-center mt-auto mb-8">
          <button onClick={clearFilterHandler}  className="bg-[#869074] text-white w-3/4 h-10 rounded-lg ">پاک کردن فیلتر ها</button>
        </div>  
      </motion.div>
    </div>
  );
}
