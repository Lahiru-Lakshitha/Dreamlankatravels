"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import hero images
import heroSigiriya from '@/assets/hero-sigiriya.jpg';
import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';

interface Slide {
  id: number;
  image: StaticImageData;
  headline: string;
  subtitle: string;
  cta: {
    text: string;
    link: string;
  };
}

const slides: Slide[] = [
  {
    id: 1,
    image: heroSigiriya,
    headline: "Discover the Jewel of Asia",
    subtitle: "Unforgettable journeys through ancient wonders, pristine beaches, and misty mountains",
    cta: { text: "Start Planning", link: "/quote" },
  },
  {
    id: 2,
    image: beachImage,
    headline: "Where Paradise Meets the Sea",
    subtitle: "Sun-kissed shores, turquoise waters, and endless tropical bliss await you",
    cta: { text: "Explore Beach Tours", link: "/tours" },
  },
  {
    id: 3,
    image: templeImage,
    headline: "Walk Through Living History",
    subtitle: "Ancient temples, sacred rituals, and 2,500 years of timeless heritage",
    cta: { text: "Cultural Journeys", link: "/tours" },
  },
  {
    id: 4,
    image: wildlifeImage,
    headline: "Into the Wild Heart",
    subtitle: "Majestic elephants, elusive leopards, and nature's most spectacular shows",
    cta: { text: "Safari Adventures", link: "/tours" },
  },
  {
    id: 5,
    image: trainImage,
    headline: "Journey Beyond the Clouds",
    subtitle: "Scenic railways, emerald tea plantations, and breathtaking highland escapes",
    cta: { text: "Get a Custom Tour", link: "/quote" },
  },
];

// Premium animated word component with staggered reveal
const AnimatedHeadline = ({
  text,
  isActive
}: {
  text: string;
  isActive: boolean;
}) => {
  const words = text.split(' ');

  return (
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-sand leading-[1.15] tracking-tight">
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden mr-[0.25em]"
        >
          <span
            className={`inline-block transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
              ? 'translate-y-0 opacity-100 blur-0'
              : 'translate-y-[120%] opacity-0 blur-[2px]'
              }`}
            style={{
              transitionDuration: '900ms',
              transitionDelay: isActive ? `${index * 80 + 200}ms` : '0ms',
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  );
};

// Animated subtitle with smooth reveal
const AnimatedSubtitle = ({
  text,
  isActive
}: {
  text: string;
  isActive: boolean;
}) => (
  <p
    className={`text-base sm:text-lg md:text-xl lg:text-2xl text-sand/90 max-w-2xl mx-auto leading-relaxed transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
      ? 'translate-y-0 opacity-100 blur-0'
      : 'translate-y-6 opacity-0 blur-[2px]'
      }`}
    style={{
      transitionDuration: '800ms',
      transitionDelay: isActive ? '700ms' : '0ms',
    }}
  >
    {text}
  </p>
);

// Premium animated CTA button
const AnimatedCTA = ({
  text,
  link,
  isActive
}: {
  text: string;
  link: string;
  isActive: boolean;
}) => (
  <div
    className={`transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
      ? 'translate-y-0 opacity-100 scale-100'
      : 'translate-y-4 opacity-0 scale-95'
      }`}
    style={{
      transitionDuration: '700ms',
      transitionDelay: isActive ? '1000ms' : '0ms',
    }}
  >
    <Link href={link}>
      <Button
        size="xl"
        className="group relative overflow-hidden bg-gradient-to-r from-sunset via-sunset to-sunset-dark text-ocean-dark font-semibold rounded-full px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg shadow-[0_10px_40px_-10px_hsl(var(--sunset)/0.5)] hover:shadow-[0_20px_60px_-10px_hsl(var(--sunset)/0.6)] transition-all duration-500 hover:-translate-y-1"
      >
        <span className="relative z-10 flex items-center gap-2">
          {text}
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-sunset-dark via-sunset to-sunset-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Button>
    </Link>
  </div>
);

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Pause when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;

    setIsTransitioning(true);
    setCurrentSlide(index);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-advance slides - faster interval (5.5 seconds)
  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, prefersReducedMotion, nextSlide]);

  return (
    <section
      className="relative w-full h-[75vh] sm:h-[80vh] lg:h-[88vh] xl:h-[90vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const zIndex = isActive ? 10 : 5;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${isActive ? 'opacity-100' : 'opacity-0'
              }`}
            style={{ zIndex }}
          >
            {/* Background Image with Very Subtle Ken Burns Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.headline}
                fill
                className={`object-cover object-center transition-transform ease-out will-change-transform ${isActive && !prefersReducedMotion
                  ? 'scale-[1.02] duration-[10000ms]'
                  : 'scale-100 duration-[800ms]'
                  }`}
                priority
              />

              {/* Very subtle gradient overlay - preserves image vibrancy */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/15" />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center justify-center">
              <div className="container mx-auto px-4 sm:px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
                  {/* Decorative Badge */}
                  <div
                    className={`transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-4 opacity-0'
                      }`}
                    style={{
                      transitionDuration: '700ms',
                      transitionDelay: isActive ? '0ms' : '0ms',
                    }}
                  >
                    <span className="inline-block px-5 py-2 text-xs sm:text-sm font-semibold 
  text-white bg-white/20 rounded-full backdrop-blur-md 
  border border-white/30 shadow-lg">
                      ✨ Award-Winning Sri Lanka Tours ✨
                    </span>

                  </div>

                  {/* Animated Headline */}
                  <AnimatedHeadline text={slide.headline} isActive={isActive} />

                  {/* Animated Subtitle */}
                  <AnimatedSubtitle text={slide.subtitle} isActive={isActive} />

                  {/* Animated CTA */}
                  <div className="pt-6 sm:pt-8 flex flex-col items-center gap-8">
                    <AnimatedCTA
                      text={slide.cta.text}
                      link={slide.cta.link}
                      isActive={isActive}
                    />

                    {/* Hero Trust Badges - Staggered Appearance */}
                    <div
                      className={`flex flex-wrap justify-center gap-4 sm:gap-6 transition-all duration-1000 delay-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    >
                      {[
                        { text: '5-Star Rated', stars: true },
                        { text: '10+ Years Experience', icon: '🏆' },
                        { text: '24/7 Local Support', icon: '📞' }
                      ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium">
                          {badge.stars ? (
                            <div className="flex text-sunset">★★★★★</div>
                          ) : (
                            <span>{badge.icon}</span>
                          )}
                          <span>{badge.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows - Desktop Only */}
      <div className="hidden lg:block">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 group shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 xl:w-6 xl:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 group shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 xl:w-6 xl:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Premium Dots Navigation with Progress */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`relative h-2 rounded-full transition-all duration-500 disabled:cursor-not-allowed overflow-hidden ${index === currentSlide
              ? 'w-8 sm:w-12 bg-white/30'
              : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Progress indicator for active slide */}
            {index === currentSlide && !isPaused && !prefersReducedMotion && (
              <span
                className="absolute inset-0 rounded-full bg-sunset origin-left animate-progress"
              />
            )}
            {index === currentSlide && (isPaused || prefersReducedMotion) && (
              <span className="absolute inset-0 rounded-full bg-sunset" />
            )}
          </button>
        ))}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        .animate-progress {
          animation: progress 5.5s linear;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-progress {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
