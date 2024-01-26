import React, { useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

const slides = [
  {
    url: "/images/banner-1.png",
  },
  {
    url: "/images/banner-2.png",
  },
  {
    url: "/images/banner-3.png",
  },
  {
    url: "/images/banner-4.png",
  },
];
export function CarouselDemo() {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="p-6 space-y-6 container max-w-7xl mx-auto">
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <CarouselContent className="flex">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="w-full overflow-hidden">
                <img
                  src={slide.url}
                  alt="sample"
                  className="w-full object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="flex items-center justify-center bg-black/20 text-white absolute top-1/2 -translate-y-1/2 z-[5] shadow-md left-4" />
          <CarouselNext className="flex items-center justify-center bg-black/20 text-white absolute top-1/2 -translate-y-1/2 z-[5] shadow-md right-4" />
        </div>
      </Carousel>
    </div>
  );
}
