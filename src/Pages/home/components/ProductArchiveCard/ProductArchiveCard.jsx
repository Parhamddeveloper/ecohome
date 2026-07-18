import { motion } from "framer-motion";
export default function ProductArchiveCard({ image, title, text, price }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="rounded-3xl shadow-2xl py-4 text-center px-5 bg-[#fbf6f0] dark:bg-gray-600 dark:text-white transition-colors duration-500 font-estedad"
    >
      <img
        src={image.thumbnail}
        alt={title}
        className="m-auto rounded-2xl w-full object-cover aspect-5/3"
      />
      <h2 className="text-lg font-bold mt-3">{title}</h2>
      <p className="mt-2 font-medium">{text}</p>
      <div className="flex justify-between items-center mt-3 text-sm">
        <span className="text-lg text-[#869074]">{price} تومان</span>
        <button className="bg-[#869074] text-white px-4 py-2 rounded-3xl font-bold">
          اضافه کردن به سبد خرید
        </button>
      </div>
    </motion.div>
  );
}
