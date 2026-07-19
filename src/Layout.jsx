import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-[#fbf6f0] dark:bg-gray-600 dark:text-white transition-colors duration-500 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
