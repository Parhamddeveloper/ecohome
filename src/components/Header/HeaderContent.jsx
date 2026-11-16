import { GiHamburgerMenu } from "react-icons/gi";
import HeaderLogo from "./HeaderLogo";
import { NavLink } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { SessionContext } from "../../context/SessionContext";
import BtnToggleTheme from "./BtnToggleTheme";
export default function HeaderContent({offCanvasHandler}) {
  const { user } = useContext(SessionContext);

  return (
    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between md:justify-normal items-center font-estedad">
      <button className="md:hidden" onClick={offCanvasHandler} aria-label="باز کردن منوی ناوبری">
        <GiHamburgerMenu className="text-3xl" />
      </button>
      <HeaderLogo image={"/EcoHomeLogo.webp"} />
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex gap-8 text-[15px] font-medium">
          <li>
            <NavLink to={"/"} className={"font-semibold"}>
              {({ isActive }) => (
                <span
                  className={isActive ? "text-[#869074] border-b-2 pb-2" : ""}
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
                  className={isActive ? "text-[#869074] border-b-2 pb-2" : ""}
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
                  className={isActive ? "text-[#869074] border-b-2 pb-2" : ""}
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
                  className={isActive ? "text-[#869074] border-b-2 pb-2" : ""}
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
                  className={isActive ? "text-[#869074] border-b-2 pb-2" : ""}
                >
                  تماس با ما
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="hidden md:flex items-center gap-x-3">
            <BtnToggleTheme/>
        <NavLink to="/account" className="grid h-10 w-40 place-items-center rounded-lg bg-[#869074] text-white">
          <span className="max-w-full truncate px-2">{user?.name ?? "ورود / ثبت نام"}</span>
        </NavLink>
      </div>
    </div>
  );
}
