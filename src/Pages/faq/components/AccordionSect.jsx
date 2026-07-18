import Accordion from "../../../components/accordion/Accordion";

export default function AccordionSect() {
  return (
    <section className="bg-[#fbf6f0] dark:bg-gray-800 flex flex-col gap-y-4">
      <Accordion />
      <Accordion />
      <Accordion />
      <Accordion />
    </section>
  );
}
