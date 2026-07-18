import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { teamMembers } from "../../../../../data/db";

export function TeamCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const scrollTo = (index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  const onSelect = (api) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  };

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on("select", () => onSelect(emblaApi));
    emblaApi.on("reInit", (api) => {
      setScrollSnaps(api.scrollSnapList());
      onSelect(api);
    });
  }, [emblaApi]);

  return (
    <div className="max-w-6xl mx-auto py-16 px-8 relative select-none">
      <div className="relative flex items-center">
        {canScrollPrev && (
          <button
            onClick={scrollPrev}
            className="absolute hidden md:block -right-6 z-10 bg-white p-3 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
        <div className="overflow-hidden w-full py-3" ref={emblaRef}>
          <div className="flex -mr-4">
            {teamMembers.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_100%] min-w-0 pr-4 sm:flex-[0_0_50%] md:flex-[0_0_33.33%]  lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
              >
                <div className="bg-white dark:bg-gray-600 rounded-xl rounded-t-full shadow-lg p-6 text-center h-full transition-[background-color,translate]  hover:-translate-y-3 duration-500">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-40 h-40 rounded-full object-cover mx-auto"
                  />

<<<<<<< HEAD
                  <h3 className="mt-4 text-xl font-estedad-bold dark:text-white">
                    {item.name}
                  </h3>

                  <p className="text-[#869074] font-estedad mt-2">
                    {item.role}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-7 font-estedad">
=======
                  <h3 className="mt-4 text-xl font-bold dark:text-white">
                    {item.name}
                  </h3>

                  <p className="text-[#869074] font-medium mt-1">
                    {item.role}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-7">
>>>>>>> 685af7ae318c652881074ef6f0cd67eaf13336db
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {canScrollNext && (
          <button
            onClick={scrollNext}
            className="absolute hidden md:block -left-6 z-10 bg-white p-3 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex justify-center gap-3 mt-8">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === selectedIndex
                ? "bg-[#899c85] w-6"
                : "bg-gray-300 w-2.5 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
