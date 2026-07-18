import { motion } from "framer-motion";
import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
export default function Accordion({ id, question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-[#ece3d8] dark:bg-gray-600 dark:text-white border rounded-xl p-3 font-estedad transition-colors duration-500">
      <button
        className="flex w-full justify-between cursor-pointer px-3"
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
        initial={{ height: 0 }}
        animate={isOpen ? { height: "auto", paddingTop: 10 } : { height: 0 }}
        transition={{ duration: 0.3 }}
        className={`overflow-hidden px-3`}
        id={`faq-answer-${id}`}
        role="region"
        aria-labelledby={`faq-question-${id}`}
      >
        <p>{answer}</p>
      </motion.div>
    </div>
  );
}
