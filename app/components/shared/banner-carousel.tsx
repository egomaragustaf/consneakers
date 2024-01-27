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
export function BannerCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
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
          <CarouselPrevious className="flex items-center justify-center bg-black/10 text-slate-300 absolute top-1/2 -translate-y-1/2 z-[5] shadow-md left-4" />
          <CarouselNext className="flex items-center justify-center bg-black/10 text-slate-300 absolute top-1/2 -translate-y-1/2 z-[5] shadow-md right-4" />
        </div>
      </Carousel>
    </div>
  );
}
