'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCardCarouselProps {
  images: string[];
  alt: string;
}

export function ProductCardCarousel({ images, alt }: ProductCardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi],
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (images.length <= 1) {
    return (
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={images[0] || '/placeholder.jpg'}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {images.map((img, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              <Image
                src={img}
                alt={`${alt} - ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1.5 opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-white"
        aria-label="Previous image"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1.5 opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-white"
        aria-label="Next image"
      >
        <ChevronRight size={14} />
      </button>

      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === selectedIndex ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
