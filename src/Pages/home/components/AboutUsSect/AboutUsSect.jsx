import { motion } from "framer-motion";
export default function AboutUsSect() {
  return (
    <section className="py-15 px-5 bg-[#98a488] dark:bg-emerald-700 dark:text-white overflow-hidden transition-colors duration-500">
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl m-auto">
        <motion.img
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true, amount: 0.7 }}
          src="/hero.webp"
          alt="دکوراسیون خانه"
          className="rounded-2xl shadow-2xl"
        />
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true, amount: 0.7 }}
          className="flex flex-col gap-y-4"
        >
          <h2 className="text-3xl font-estedad-bold">درباره ما</h2>
          <h3 className="text-xl font-estedad-bold">
            ما شرکت تولید کننده دکور های خانه سازگار محیط زیست هستیم
          </h3>
          <p className="text-lg text-justify font-estedad-light">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
            استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و
            کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد کتابهای زیادی
            در شصت و سه درصد گذشته حال و آینده شناخت فراوان جامعه و متخصصان را
            می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی
            الخصوص طراحان خلاقی
          </p>
        </motion.div>
      </div>
    </section>
  );
}
