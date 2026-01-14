"use client";

import { useState, useEffect, useRef, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Assets
import heroSigiriya from '@/assets/hero-sigiriya.jpg';
import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';

// Internal Component not needed anymore with CSS keyframes
// The key={slide.id} ensures re-mount and animation replay

const slides = [
  {
    id: 1,
    image: heroSigiriya,
    title: "Discover the Jewel of Asia",
    subtitle: "Journey through ancient wonders and pristine landscapes.",
    link: "/tours"
  },
  {
    id: 2,
    image: beachImage,
    title: "Paradise Found",
    subtitle: "Relax on the world's most beautiful golden shores.",
    link: "/tours"
  },
  {
    id: 3,
    image: templeImage,
    title: "Timeless Heritage",
    subtitle: "Explore 2,500 years of living history and culture.",
    link: "/tours"
  },
  {
    id: 4,
    image: wildlifeImage,
    title: "Wild & Untamed",
    subtitle: "Witness majestic gentle giants in their natural habitat.",
    link: "/tours"
  },
];

function HeroCarouselBase() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 6000);
    }
  }, [isPaused]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    resetTimer();
  }, [resetTimer]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  }, [resetTimer]);

  const handleDotClick = useCallback((index: number) => {
    setCurrent(index);
    resetTimer();
  }, [resetTimer]);

  return (
    <section
      className="relative w-full h-[75vh] lg:h-[85vh] overflow-hidden bg-black group touch-manipulation"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured Destinations Carousel"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0} // Only priority load the first image
              className="object-cover"
              sizes="100vw"
              quality={90}
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/30 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          </div>
        );
      })}

      {/* Content Overlay (Centered) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center pointer-events-none">
        <div className="container px-4 pointer-events-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {slides.map((slide, index) => {
              const isActive = index === current;
              if (!isActive) return null;

              return (
                <div key={slide.id} className="relative z-10 w-full flex flex-col items-center will-change-transform will-change-opacity">
                  {/* 1. Badge */}
                  <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/20 animate-soft-scale">
                    Luxury Sri Lanka
                  </span>

                  {/* 2. Headline */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-md animate-cinematic-up delay-100">
                    {slide.title}
                  </h1>

                  {/* 3. Subheadline */}
                  <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed drop-shadow-sm animate-soft-fade delay-300">
                    {slide.subtitle}
                  </p>

                  {/* 4. CTA Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-soft-scale delay-500">
                    <Link href={slide.link}>
                      <Button size="lg" className="w-full sm:w-auto rounded-full px-6 sm:px-8 h-10 sm:h-12 text-sm sm:text-base bg-white text-primary hover:bg-white/90 transition-transform hover:scale-105 shadow-xl font-semibold">
                        Explore Tours
                      </Button>
                    </Link>
                    <Link href="/quote">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto rounded-full px-6 sm:px-8 h-10 sm:h-12 text-sm sm:text-base border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary backdrop-blur-sm transition-all hover:scale-105 font-semibold shadow-lg"
                      >
                        Start Planning
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Controls - Premium Glass Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-[38%] -translate-y-1/2 md:top-1/2 md:-translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group/nav bg-black/40 text-white pointer-events-auto opacity-0 group-hover:opacity-100 active:opacity-100 focus:opacity-100 sm:bg-black/40 sm:text-white md:border md:border-white/20 md:bg-white/10 md:text-white md:shadow-lg md:backdrop-blur-md md:hover:bg-white/20 md:hover:scale-105 md:active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 transition-transform group-hover/nav:-translate-x-0.5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-[38%] -translate-y-1/2 md:top-1/2 md:-translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group/nav bg-black/40 text-white pointer-events-auto opacity-0 group-hover:opacity-100 active:opacity-100 focus:opacity-100 sm:bg-black/40 sm:text-white md:border md:border-white/20 md:bg-white/10 md:text-white md:shadow-lg md:backdrop-blur-md md:hover:bg-white/20 md:hover:scale-105 md:active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 transition-transform group-hover/nav:translate-x-0.5" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${current === index
              ? 'w-8 bg-white shadow-lg'
              : 'w-2 bg-white/40 hover:bg-white/80 hover:w-6'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export const HeroCarousel = memo(HeroCarouselBase);
