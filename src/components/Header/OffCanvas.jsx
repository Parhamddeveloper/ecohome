import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { ThemeContext } from "../../context/ThemeContext";
import BtnToggleTheme from "./BtnToggleTheme";
import { NavLink } from "react-router-dom";

export default function OffCanvas({ offCanvasHandler }) {
    useEffect(()=>{
        document.documentElement.classList.add("overflow-hidden")
        
        return ()=>{
            document.documentElement.classList.remove("overflow-hidden")
        }
    },[])
  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 "
        onClick={offCanvasHandler}
      ></motion.div>

      <motion.aside
        className="absolute right-0 top-0 h-full w-80 bg-[#e0dbd5] dark:bg-gray-800 dark:text-white flex flex-col p-5 text-xl transition-colors duration-500"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <div className="flex justify-between items-center">
          <button aria-label="close canvas button">
            <IoMdClose className="text-3xl" onClick={offCanvasHandler} />
          </button>
          <BtnToggleTheme />
        </div>
        <nav className="flex mt-6">
          <ul className="flex flex-col  gap-y-12 text-[15px] font-medium">
            <li>
              <NavLink to={"/"} className={"font-semibold"}>
                {({ isActive }) => (
                  <span
                    className={isActive ? "text-[#869074] border-s-4 pr-2 pb-2" : ""}
                  >
                    خانه
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/projects"} className={"font-semibold"}>
                {({ isActive }) => (
                  <span
                    className={isActive ? "text-[#869074] border-s-4 pr-2 pb-2" : ""}
                  >
                    پروژه ها
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/weblogs"} className={"font-semibold"}>
                {({ isActive }) => (
                  <span
                    className={isActive ? "text-[#869074] border-s-4 pr-2 pb-2" : ""}
                  >
                    وبلاگ
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/about-us"} className={"font-semibold"}>
                {({ isActive }) => (
                  <span
                    className={isActive ? "text-[#869074] border-s-4 pr-2 pb-2" : ""}
                  >
                    درباره ما
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/contact-us"} className={"font-semibold"}>
                {({ isActive }) => (
                  <span
                    className={isActive ? "text-[#869074] border-s-4 pr-2 pb-2" : ""}
                  >
                    تماس با ما
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="mx-auto w-full flex justify-center mt-auto mb-5">
          <button className="bg-[#869074] text-white w-3/4 h-10 rounded-lg ">
            ورود / ثبت نام
          </button>
        </div>
      </motion.aside>
    </div>
  );
}
