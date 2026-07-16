import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import HeaderLogo from "./HeaderLogo";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import HeaderContent from "./HeaderContent";
import OffCanvas from "./OffCanvas";

export default function Header() {
  const [IsSticky, SetIsSticky] = useState(false);
  const [isOffcanvasOpen, setIsOffCanvasOpen] = useState(false);
  const offCanvasHandler = () => setIsOffCanvasOpen((prev) => !prev);
  useEffect(() => {
    const ScrollHandler = () => {
      const shouldBeSticky = window.scrollY > 200;
      SetIsSticky((prev) => (prev !== shouldBeSticky ? shouldBeSticky : prev));
    };
    window.addEventListener("scroll", ScrollHandler);

    return () => window.removeEventListener("scroll", ScrollHandler);
  }, []);

  return (
    <>
      <header className="bg-[#e0dbd5] dark:bg-gray-800 text-black dark:text-white transition-colors duration-500 relative">
        <HeaderContent offCanvasHandler={offCanvasHandler} />
      </header>
      <AnimatePresence>
        {IsSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed top-0 left-0 right-0 z-40 bg-[#e0dbd5]/95 text-black dark:bg-gray-800/95 dark:text-white backdrop-blur-md shadow-lg   transition-colors duration-500"
          >
            <HeaderContent offCanvasHandler={offCanvasHandler} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isOffcanvasOpen && <OffCanvas offCanvasHandler={offCanvasHandler} />}
      </AnimatePresence>
    </>
  );
}
