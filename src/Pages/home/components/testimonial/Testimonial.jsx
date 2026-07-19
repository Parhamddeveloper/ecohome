import { Carousel } from "../../../../components/carousel/carousel";
import ClientCarousel from "./ClientCarousel";


export default function Testimonial() {
  return (
    <section className="pt-10 bg-[#fbf6f0] dark:bg-gray-800 overflow-hidden transition-colors duration-500">
      <h2 className="text-center text-3xl font-bold dark:text-white font-estedad-bold">رضایت مشتری</h2>
      <div className="max-w-7xl mx-auto mt-3">
        <Carousel>
          <ClientCarousel/>
        </Carousel>
      </div>
    </section>
  );
}
