"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

export function QuickQuotePreview() {
  const router = useRouter();
  const { t } = useLanguage();
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [tourStyle, setTourStyle] = useState('');

  const handleGetQuote = () => {
    // Navigate to quote page with pre-filled data
    const params = new URLSearchParams();
    if (arrivalDate) params.set('arrival', arrivalDate);
    if (departureDate) params.set('departure', departureDate);
    if (groupSize) params.set('travelers', groupSize);
    if (tourStyle) params.set('style', tourStyle);

    router.push(`/quote?${params.toString()}`);
  };

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden bg-background">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[hsl(45,80%,60%)]/8 rounded-full translate-x-1/4 translate-y-1/4 blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary/30 rounded-full" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary/20 rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Premium floating card with enhanced styling */}
          <div
            className="bg-card rounded-3xl shadow-xl border border-border/10 p-6 sm:p-8 lg:p-10 opacity-0 animate-fade-up transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left - Text Content */}
              <div className="opacity-0 animate-fade-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5 shadow-sm">
                  <Compass className="w-4 h-4" />
                  <span>{t.home?.curatedExperiences || 'Personalized Planning'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 leading-tight">
                  {t.home?.readyToExplore || 'Plan Your Perfect Sri Lanka Journey'}
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  {t.home?.ctaSubtitle || 'Tell us your travel details and receive a personalized luxury itinerary crafted just for you.'}
                </p>
              </div>

              {/* Right - Mini Form */}
              <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                <div className="grid grid-cols-2 gap-3">
                  {/* Arrival Date */}
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none transition-colors group-focus-within:text-primary" />
                    <Input
                      type="date"
                      placeholder={t.quote?.startDate || 'Arrival'}
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-border/50 bg-background hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all shadow-sm"
                    />
                  </div>

                  {/* Departure Date */}
                  <div className="relative group">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50 pointer-events-none transition-colors group-focus-within:text-primary" />
                    <Input
                      type="date"
                      placeholder={t.quote?.endDate || 'Departure'}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-border/50 bg-background hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Group Size */}
                  <Select value={groupSize} onValueChange={setGroupSize}>
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background hover:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all shadow-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary/50" />
                        <SelectValue placeholder={t.quote?.travelers || 'Group Size'} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1–2 {t.quote?.people || 'Travelers'}</SelectItem>
                      <SelectItem value="3-5">3–5 {t.quote?.people || 'Travelers'}</SelectItem>
                      <SelectItem value="6-10">6–10 {t.quote?.people || 'Travelers'}</SelectItem>
                      <SelectItem value="10+">10+ {t.quote?.people || 'Travelers'}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Tour Style */}
                  <Select value={tourStyle} onValueChange={setTourStyle}>
                    <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background hover:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all shadow-sm">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-primary/50" />
                        <SelectValue placeholder={t.quote?.tourType || 'Tour Style'} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cultural">{t.quote?.culturalHeritage || 'Cultural Heritage'}</SelectItem>
                      <SelectItem value="wildlife">{t.quote?.wildlifeSafari || 'Wildlife Safari'}</SelectItem>
                      <SelectItem value="beach">{t.quote?.beachHoliday || 'Beach & Relaxation'}</SelectItem>
                      <SelectItem value="adventure">{t.quote?.adventure || 'Adventure'}</SelectItem>
                      <SelectItem value="honeymoon">{t.quote?.honeymoon || 'Honeymoon'}</SelectItem>
                      <SelectItem value="custom">{t.quote?.custom || 'Custom Tour'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleGetQuote}
                  className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group shadow-md"
                >
                  {t.nav?.getQuote || 'Get Your Custom Quote'}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
