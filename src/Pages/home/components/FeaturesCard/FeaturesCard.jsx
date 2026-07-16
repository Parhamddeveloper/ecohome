import { motion } from "framer-motion";
export default function FeaturesCard({ title, text, image }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-[#fbf6f0] dark:bg-gray-600 dark:text-white rounded-3xl shadow-2xl py-4 text-center px-5 relative bottom-2 md:bottom-15 transition-colors duration-500"
    >
      <img src={image} alt={title} className="m-auto w-44" />
      <h2 className="text-lg font-bold ">{title}</h2>
      <p className="mt-2 font-medium">{text}</p>
    </motion.div>
  );
}
