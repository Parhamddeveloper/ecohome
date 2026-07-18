import { motion } from "framer-motion";
import { TeamCarousel } from "./TeamCarousel";
export default function OurTeam() {
  return (
    <section className="pt-10 bg-[#fbf6f0] dark:bg-gray-800 overflow-hidden transition-colors duration-500">
      <motion.h2
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.7 }}
<<<<<<< HEAD
        className="text-center text-4xl font-estedad-bold dark:text-white"
=======
        className="text-center text-3xl font-bold dark:text-white"
>>>>>>> 685af7ae318c652881074ef6f0cd67eaf13336db
      >
        اعضای تیم ما
      </motion.h2>
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        className="max-w-7xl mx-auto"
      >
        <TeamCarousel />
      </motion.div>
    </section>
  );
}
