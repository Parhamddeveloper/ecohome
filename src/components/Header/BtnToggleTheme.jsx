import { motion,AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa6";
export default function BtnToggleTheme() {
  const { Theme, ToggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      onClick={ToggleTheme}
      className="border-2 border-[#869074] p-2 rounded-lg text-black dark:text-white cursor-pointer overflow-hidden"
      aria-label={Theme === "dark" ? "فعال کردن حالت روشن" : "فعال کردن حالت تیره"}
    >
      <AnimatePresence mode="wait">
        {Theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: 10, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -10, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <FaMoon />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 10, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -10, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <FaSun />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
