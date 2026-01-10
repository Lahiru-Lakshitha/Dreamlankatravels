import { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Award, Star } from 'lucide-react';
import { t } from '@/data/translations';

interface StatItem {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  duration: number;
  isDecimal?: boolean;
}

function useCountUp(end: number, duration: number, start: boolean, isDecimal?: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic for smooth finish
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(isDecimal ? Math.round(eased * end) / 10 : Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start, isDecimal]);

  return count;
}

function StatCard({
  stat,
  index,
  isVisible
}: {
  stat: StatItem;
  index: number;
  isVisible: boolean;
}) {
  const count = useCountUp(stat.value, stat.duration, isVisible, stat.isDecimal);
  const Icon = stat.icon;

  return (
    <div
      className={`text-center group transition-all duration-700 ease-out p-4 sm:p-5 rounded-2xl bg-white dark:bg-white/5 border border-primary/10 dark:border-white/10 shadow-sm dark:shadow-none hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-10 h-10 sm:w-11 sm:h-11 mx-auto mb-2.5 rounded-lg bg-primary/8 dark:bg-white/10 flex items-center justify-center transform transition-all duration-500 group-hover:scale-105 group-hover:bg-primary/12 dark:group-hover:bg-white/20">
        <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-primary dark:text-white" />
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-0.5 tracking-tight">
        {stat.isDecimal ? count.toFixed(1) : count}{stat.suffix}
      </div>
      <div className="text-muted-foreground/70 dark:text-white/60 font-medium text-xs sm:text-sm">
        {stat.label}
      </div>
    </div>
  );
}

export function StatsSection() {

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats: StatItem[] = [
    { icon: Users, value: 15000, suffix: '+', label: t.home.happyTravelers, duration: 2000 },
    { icon: MapPin, value: 50, suffix: '+', label: t.home.destinationsCount, duration: 1400 },
    { icon: Award, value: 10, suffix: '+', label: t.home.yearsExperience, duration: 1200 },
    { icon: Star, value: 49, suffix: '', label: t.home.averageRating, duration: 1000, isDecimal: true },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-8 sm:py-10 lg:py-12 relative overflow-hidden"
    >
      {/* Clean background with very subtle gray wash */}
      <div className="absolute inset-0 bg-white dark:bg-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20 dark:from-transparent dark:to-black/20" />

      {/* Subtle texture overlay for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft decorative accents */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-primary/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/4 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Compact section header */}
        <div className={`text-center mb-6 sm:mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-semibold text-primary bg-primary/8 rounded-full mb-2 uppercase tracking-wider">
            {t.stats?.ourImpact || 'Our Impact'}
          </span>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
            {t.stats?.numbersThatSpeak || 'Numbers That Speak'}
          </h2>
        </div>

        {/* Stats grid - compact layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
