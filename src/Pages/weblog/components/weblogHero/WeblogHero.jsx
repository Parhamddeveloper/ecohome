import { useState } from "react";
import { motion } from "framer-motion";
export default function WeblogHero(params) {
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  return (
    <>
      <section className="h-[250px] relative">
        <img
          src="/project2.jpg"
          className="object-cover absolute w-full h-full"
          alt="Contact us hero image"
          onLoad={() => setIsImgLoaded(true)}
        />
        <div className="inset-0 bg-black/45 absolute"></div>
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={isImgLoaded && { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col items-center justify-center h-full w-full gap-y-4 text-white font-bold text-center"
        >
          <h1 className="text-3xl font-estedad-extra-bold">وبلاگ ما</h1>
          <p className="text-2xl font-estedad">
            با وبلاگ های ما، خانه خود را شیک تر کنید
          </p>
        </motion.div>
      </section>
    </>
  );
}
