import { motion } from "framer-motion";
import { TeamCarousel } from "./TeamCarousel";
export default function OurTeam() {
  return (
    <section className="pt-10 bg-[#fbf6f0] dark:bg-gray-800 overflow-hidden transition-colors duration-500">
      <h2 className="text-center text-3xl font-bold dark:text-white">
        رضایت مشتری
      </h2>
      <div className="max-w-7xl mx-auto mt-3">
        <TeamCarousel />
      </div>
    </section>
  );
}
