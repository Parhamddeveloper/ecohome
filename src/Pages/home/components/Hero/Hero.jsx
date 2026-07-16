import { Link } from "react-router-dom";
import { motion, scale } from "framer-motion";
import { useState } from "react";
export default function Hero() {
  const MotionLink = motion.create(Link);

  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <>
      <section className="relative h-[650px] overflow-hidden">
        <img
          src="/hero.webp"
          className="absolute inset-0 w-full h-full object-cover "
          alt="Hero image"
          onLoad={() => setIsImgLoaded(true)}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {isImgLoaded && (
          <div className="relative z-10 px-10 mx-auto h-full flex flex-col md:items-start justify-center lg:px-24 gap-y-4">
            <motion.h1
              initial={{ x: 90, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-3xl lg:text-6xl font-black text-white"
            >
              با اکوهوم، خانه خود را درخشان کنید
            </motion.h1>
            <motion.p
              initial={{ x: 90, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-2xl font-black text-gray-100"
            >
              دیزاین داخلی خانه، سازگار با طبیعت
            </motion.p>
            <div className="flex gap-x-4 mt-4">
              <MotionLink
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-[#869074] text-white w-34 py-2.5 rounded-lg font-bold text-center transition-transform hover:scale-105"
              >
                پروژه
              </MotionLink>
              <MotionLink
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-[#ffffff] text-black w-34  py-2.5 rounded-lg font-bold text-center transition-transform hover:scale-105"
              >
                درباره ما
              </MotionLink>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
