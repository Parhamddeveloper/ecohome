import { DecorArchives, Features } from "../../../../../data/db";
import FeaturesCard from "../FeaturesCard/FeaturesCard";
import ProductArchiveCard from "../ProductArchiveCard/ProductArchiveCard";
import {motion} from "framer-motion"
export default function DecorArchivesSect() {
  return (
    <section className="bg-[#fbf6f0] dark:bg-gray-800 transition-colors duration-500 pb-3">
      <div className="grid max-w-7xl mx-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 xl:m-auto">
        {Features.map((FeatureItem) => (
          <FeaturesCard key={FeatureItem.id} {...FeatureItem} />
        ))}
      </div>
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center text-3xl font-bold my-6 lg:mb-7 dark:text-white"
        >
          آرشیو دکور ها
        </motion.h2>
        <div className="grid max-w-7xl mx-3  grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-x-10 gap-y-10 xl:m-auto ">
          {DecorArchives.map((DecorItem) => (
            <ProductArchiveCard key={DecorItem.id} {...DecorItem} />
          ))}
        </div>
      </div>
    </section>
  );
}
