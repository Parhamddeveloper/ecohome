import { motion } from "framer-motion";
import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
export default function Accordion() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-[#fbf6f0] dark:bg-gray-600 dark:text-white border rounded-xl">
      <button
        className="flex w-full justify-between p-3"
        id="faq-question-1"
        aria-expanded={isOpen}
        aria-controls="faq-answer-1"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>سلام چطوری؟ خوبی؟ چه خبره؟</span>
        <SlArrowDown
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <motion.div
        initial={{ height: 0 }}
        animate={isOpen ? { height: "auto" } : { height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
        id="faq-answer-1"
        role="region"
        aria-labelledby="faq-question-1"
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
          asperiores, earum, omnis possimus repudiandae inventore, voluptate non
          ullam voluptatibus quod dignissimos. Cum, perferendis!
        </p>
      </motion.div>
    </div>
  );
}
