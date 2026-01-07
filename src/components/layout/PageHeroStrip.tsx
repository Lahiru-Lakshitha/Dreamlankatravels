import { cn } from '@/lib/utils';

interface PageHeroStripProps {
  accentLabel?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeroStrip({ accentLabel, title, subtitle, className }: PageHeroStripProps) {
  return (
    <section 
      className={cn(
        "relative py-12 sm:py-16 overflow-hidden",
        className
      )}
    >
      {/* Premium green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(160,45%,28%)] via-[hsl(160,40%,35%)] to-[hsl(160,35%,42%)]" />
      
      {/* Subtle texture overlay for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[hsl(45,80%,60%)]/10 rounded-full blur-2xl translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          {/* Gold accent label */}
          {accentLabel && (
            <span 
              className="inline-block px-4 py-1.5 rounded-full bg-[hsl(45,80%,60%)]/20 text-[hsl(45,80%,70%)] font-medium text-sm mb-4 tracking-wide"
              style={{ animationDelay: '0.1s' }}
            >
              {accentLabel}
            </span>
          )}
          
          {/* Page title - elegant serif */}
          <h1 
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4"
            style={{ animationDelay: '0.15s' }}
          >
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p 
              className="text-white/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ animationDelay: '0.2s' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
