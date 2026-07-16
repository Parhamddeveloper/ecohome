import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();
export default function ThemeProvider({ children }) {
  const ToggleTheme = () => {
    setTheme((PrevState) => (PrevState === "dark" ? "light" : "dark"));
  };
  const [Theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      return savedTheme;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", Theme === "dark");
    localStorage.setItem("theme", Theme);

  }, [Theme]);
  return (
    <ThemeContext.Provider value={{ Theme, ToggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
