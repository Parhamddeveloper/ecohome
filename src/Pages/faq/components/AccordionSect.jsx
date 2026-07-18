import { FAQ } from "../../../../data/db";
import Accordion from "../../../components/accordion/Accordion";

export default function AccordionSect() {
  return (
    <section className="bg-[#fbf6f0] dark:bg-gray-500 py-4 transition-colors duration-500">
        <h1 className="text-center text-2xl font-estedad-extra-bold dark:text-white">سوالات متداول</h1>
      <div className="flex flex-col gap-y-4 max-w-7xl mx-auto mt-7">
        {FAQ.map((Item) => (
          <Accordion key={Item.id} {...Item} />
        ))}
      </div>
    </section>
  );
}
