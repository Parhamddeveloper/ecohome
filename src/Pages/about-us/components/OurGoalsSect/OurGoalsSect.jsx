import { goals } from "../../../../../data/db";
import GoalCard from "./GoalCard";
import { motion } from "framer-motion";
export default function OurGoalsSect() {
  return (
    <section className="bg-[#fbf6f0] dark:bg-gray-800 transition-colors duration-500 pb-3">
      <motion.h2
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
<<<<<<< HEAD
        className="dark:text-white text-4xl font-estedad-bold text-center py-6"
=======
        className="dark:text-white text-3xl font-bold text-center py-6"
>>>>>>> 685af7ae318c652881074ef6f0cd67eaf13336db
      >
        اهداف تیم ما
      </motion.h2>
      <div className="grid max-w-7xl mx-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 xl:m-auto py-5">
        {goals.map((GoalItem) => (
          <GoalCard key={GoalItem.id} {...GoalItem} />
        ))}
      </div>
    </section>
  );
}
