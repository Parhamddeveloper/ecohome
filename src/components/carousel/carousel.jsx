import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

export function Carousel({children}) {
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
          {children}
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
