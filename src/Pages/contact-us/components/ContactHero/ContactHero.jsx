import { motion } from "framer-motion";
export default function ContactHero() {
  const AboutHero = {
    initial:{
      opacity:0
    },
    animate:{
      opacity:1
    }
  }
  return (
    <section className="h-[400px] relative">
      <img
        src="/ContactUsHero.webp"
        className="object-cover object-[40%_60%] absolute w-full h-full"
        alt="Contact us hero image"
      />
      <div className="absolute inset-0 bg-black/45"></div>
      <motion.div initial={{opacity : 0,scale:0.85}} animate={{opacity : 1,scale:1}} transition={{duration : 0.7}}  className="relative z-10 flex flex-col gap-y-4 h-full w-full justify-center items-center text-white">
        <h1 className="text-4xl font-bold">با اکوهوم در ارتباط باشید</h1>
        <p>بیاید با هم دکور مورد علاقه شما را بسازیم</p>
      </motion.div>
    </section>
  );
}
