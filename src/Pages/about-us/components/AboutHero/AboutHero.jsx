import { useState } from "react";
import { motion } from "framer-motion";
export default function AboutHero() {
    const [isImgLoaded,setIsImgLoaded] = useState(false)
  return (
    <>
      <section className="h-[450px] relative">
        <img
          src="/ContactUsHero.webp"
          className="object-cover object-[40%_60%] absolute w-full h-full"
          alt="Contact us hero image"
          onLoad={() => setIsImgLoaded(true)}
        />
        <div className="inset-0 bg-black/45 absolute"></div>
        <motion.div initial={{scale:0.75,opacity : 0}} animate={isImgLoaded && {scale:1,opacity:1}} transition={{duration : 0.6}} className="relative flex flex-col items-center justify-center h-full w-full gap-y-4 text-white font-bold text-center">
          <h1 className="text-3xl" >ما پویایی خانه سبز هستیم</h1>
          <p className="text-2xl">داستان ما را بدانید و با اعضای تیم ما آشنا شوید</p>
        </motion.div>
      </section>
    </>
  );
}
