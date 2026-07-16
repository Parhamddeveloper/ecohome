import { motion } from "framer-motion";
import { useState } from "react";
export default function FormSect() {
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  return (
    <>
      <section className="bg-[#e0dbd5] dark:bg-gray-800 dark:text-white transition-colors duration-500 overflow-hidden">
        <div className="max-w-7xl mx-4 xl:mx-auto grid grid-cols-1 lg:grid-cols-2 py-6 items-center">
          <div className="order-2 lg:order-1">
            <motion.h2
              className="text-2xl text-center font-bold lg:text-start"
              initial={{ x: 90, opacity: 0 }}
              animate={isImgLoaded &&{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              ایده خود را به اشتراک بگذارید
            </motion.h2>
            <motion.form
              initial={{ x: 90, opacity: 0 }}
              animate={isImgLoaded && { x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full flex flex-col gap-y-3 mt-7"
            >
              <div className="grid md:grid-cols-2 gap-x-4 gap-y-3">
                <input
                  type="text"
                  className="border-2 border-[#788069] rounded-lg w-full py-2 px-3 focus:outline-0 placeholder:text-black/45 dark:placeholder:text-white/65 dark:border-[#869074]"
                  placeholder="نام و نام خانوادگی"
                />
                <input
                  type="text"
                  className="border-2 border-[#788069] rounded-lg w-full py-2 px-3 focus:outline-0 placeholder:text-black/45 dark:placeholder:text-white/65 dark:border-[#869074]"
                  placeholder="آدرس ایمیل"
                />
              </div>

              <input
                type="text"
                className="border-2 border-[#788069] rounded-lg w-full py-2 px-3 focus:outline-0 placeholder:text-black/45 dark:placeholder:text-white/65 dark:border-[#869074]"
                placeholder="موضوع"
              />
              <textarea
                name=""
                id=""
                className="border-2 border-[#788069] rounded-lg w-full py-2 px-3 focus:outline-0 placeholder:text-black/45 dark:placeholder:text-white/65 dark:border-[#869074]"
                rows={5}
                placeholder="پروژه / متن شما"
              ></textarea>
              <button
                type="submit"
                className="bg-[#869074] py-3 rounded-3xl text-white"
              >
                ارسال پیام
              </button>
            </motion.form>
          </div>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={isImgLoaded && { scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center lg:justify-end order-1 lg:order-2"
          >
            <img
              src="/AboutUsFormImg.webp"
              onLoad={() => setIsImgLoaded(true)}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
