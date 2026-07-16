import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ClientStories } from "../../../../../data/db";

export function ClientCarousel() {
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
    emblaApi.on("select",()=> onSelect(emblaApi));
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
          <div className="overflow-hidden w-full" ref={emblaRef}>
            <div className="flex -mr-4">
              {ClientStories.map((item) => (
                <div
                  key={item.id}
                  className="flex-[0_0_100%] min-w-0 pr-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                >
                  <div className="bg-transparent p-6 flex flex-col justify-between h-full">
                    <p className="text-gray-600 text-md leading-relaxed mb-6 italic text-right lg:text-sm dark:text-white">
                      "{item.client_message}"
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <img
                        src={item.client_img}
                        alt={item.clientname}
                        className="w-13 h-13 rounded-full object-cover"
                      />
                      <span className="font-semibold text-sm text-gray-800 dark:text-white">
                        {item.clientname}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {canScrollNext && (
            <button
              onClick={scrollNext}
              className="absolute hidden md:block -left-2 z-10 bg-white p-3 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer"
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
        <div className="flex justify-center gap-2 mt-8">
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
