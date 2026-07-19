import { motion } from "framer-motion";
import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
export default function Accordion({ id, question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#ece3d8] dark:bg-gray-600 dark:text-white border rounded-xl p-3 font-estedad transition-colors duration-500"
    >
      <button
        className="flex w-full justify-between items-center cursor-pointer px-3"
        id={`faq-question-${id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${id}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{question}</span>
        <SlArrowDown
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          height: {
            duration: 0.3,
          },
          opacity: {
            duration: 0.2,
          },
        }}
        className="overflow-hidden"
      >
        <div className="px-3 pt-3" id={`faq-answer-${id}`} aria-labelledby={`faq-question-${id}`}>
          <p>{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
