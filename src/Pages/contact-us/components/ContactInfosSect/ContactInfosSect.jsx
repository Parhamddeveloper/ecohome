import { MdPhoneInTalk } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useState } from "react";
export default function ContactInfosSect() {
  const [isImgLoaded, setIsImgLoaded] = useState({
    Telephone: false,
    Mail: false,
    Building: false,
  });
  return (
    <section className="bg-[#e0dbd5] dark:bg-gray-800 dark:text-white transition-colors duration-500 overflow-hidden font-estedad">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-2xl text-center font-estedad-extra-bold"
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={
            isImgLoaded.Mail &&
            isImgLoaded.Telephone && { scale: 1, opacity: 1 }
          }
          transition={{ duration: 1 }}
          viewport={{ once: true, amount: 0.7 }}
        >
          اطلاعات تماس
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 mx-2">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={
              isImgLoaded.Mail &&
              isImgLoaded.Telephone && { scale: 1, opacity: 1 }
            }
            transition={{ duration: 1 }}
            viewport={{ once: true, amount: 0.7 }}
          >
            <img
              src="/Mail.webp"
              alt="mail image"
              className="w-[400px] h-auto  mx-auto hidden lg:block"
              onLoad={() => setIsImgLoaded((prev) => ({ ...prev, Mail: true }))}
            />
          </motion.div>
          {
            <div className="flex flex-col text-xl lg:text-2xl">
              <motion.img
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={
                  isImgLoaded.Mail &&
                  isImgLoaded.Telephone && { scale: 1, opacity: 1 }
                }
                transition={{ duration: 1 }}
                viewport={{ once: true, amount: 0.7 }}
                src="/Telephone.webp"
                alt="vintage telephone image"
                className="mx-auto w-96 h-auto"
                onLoad={() =>
                  setIsImgLoaded((prev) => ({ ...prev, Telephone: true }))
                }
              />
              <motion.div
                className="flex justify-end gap-x-5"
                initial={{ x: -20, opacity: 0 }}
                whileInView={
                  isImgLoaded.Mail &&
                  isImgLoaded.Telephone && { x: 0, opacity: 1 }
                }
                transition={{ duration: 0.7 }}
                viewport={{ once: true, amount: 0.7 }}
              >
                <span dir="ltr">+982155454455</span>
                <MdPhoneInTalk className="text-[#9da772] text-4xl" />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={
                  isImgLoaded.Mail &&
                  isImgLoaded.Telephone && { x: 0, opacity: 1 }
                }
                transition={{ duration: 0.7 }}
                viewport={{ once: true, amount: 0.7 }}
                className="flex justify-end items-center gap-x-5 mt-3"
              >
                <span dir="ltr">parhamdaneshneajd@gmail.com</span>
                <IoMail className="text-[#9da772] text-4xl" />
              </motion.div>
            </div>
          }
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 py-7 px-3">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={isImgLoaded.Building && { x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.7 }}
            className="pt-5 lg:pt-10"
          >
            <h3 className="text-2xl font-estedad-extra-bold text-center lg:text-start">
              به استودیو طراحی ما سر بزنید
            </h3>
            <div className="flex items-center text-2xl mt-7 gap-x-3 lg:w-2/3 ">
              <FaLocationDot className="text-3xl" />
              <span>تهران، نارمک، خیابان پروانه، کوچه 123، پلاک 1، واحد 2</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={isImgLoaded.Building && { x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.7 }}
          >
            <img
              src="/building.webp"
              alt="Building Image"
              className="w-full h-full"
              onLoad={() =>
                setIsImgLoaded((prev) => ({ ...prev, Building: true }))
              }
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
