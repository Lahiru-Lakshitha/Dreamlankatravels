"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Compass, ArrowRight, MapPin } from 'lucide-react';
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
import { motion } from 'framer-motion';

export function QuickQuotePreview() {
  const router = useRouter();
  const { t } = useLanguage();
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [tourStyle, setTourStyle] = useState('');

  const handleGetQuote = () => {
    const params = new URLSearchParams();
    if (arrivalDate) params.set('arrival', arrivalDate);
    if (departureDate) params.set('departure', departureDate);
    if (groupSize) params.set('travelers', groupSize);
    if (tourStyle) params.set('style', tourStyle);
    router.push(`/quote?${params.toString()}`);
  };

  return (
    <div className="w-full relative">
      {/* Premium Glass Card Container */}
      {/* Premium Glass Card Container */}
      <div
        className="bg-white/90 dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl dark:shadow-glow border border-white/80 dark:border-white/10 p-8 md:p-12 overflow-hidden relative ring-1 ring-white/50 dark:ring-white/5"
      >
        {/* Subtle Background Gradient/Glow - Enhanced for Visibility */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-emerald-100/80 via-teal-100/60 to-transparent dark:from-emerald-500/10 dark:via-teal-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-orange-100/80 to-transparent dark:from-orange-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Content */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean/5 dark:bg-white/10 text-ocean dark:text-white font-bold tracking-wider uppercase text-xs border border-ocean/10 dark:border-white/10 shadow-sm">
              <Compass className="w-4 h-4" />
              <span>{t.home?.curatedExperiences || 'Plan Your Journey'}</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-ocean-dark dark:text-white leading-tight">
              {t.home?.readyToExplore || 'Ready to Explore Sri Lanka?'}
            </h2>

            <p className="text-muted-foreground dark:text-white/70 text-lg leading-relaxed font-medium">
              {t.home?.ctaSubtitle || 'Let us craft your perfect getaway. Tell us your preferences, and our experts will create a bespoke itinerary just for you.'}
            </p>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/50 dark:border-white/10 shadow-sm ring-1 ring-white/40 dark:ring-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date Inputs */}
              <div className="space-y-5">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-ocean/5 dark:bg-white/10 rounded-full flex items-center justify-center text-ocean dark:text-white group-hover:bg-ocean group-hover:text-white transition-colors duration-300">
                    <Calendar className="w-5 h-5 pointer-events-none" />
                  </div>
                  <Input
                    type="text"
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => e.target.type = 'text'}
                    placeholder={t.quote?.startDate || 'Arrival Date'}
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="pl-16 h-14 rounded-full border-transparent bg-white dark:bg-white/10 shadow-soft hover:shadow-md focus:shadow-strong transition-all text-base text-ocean-dark dark:text-white placeholder:text-muted-foreground/70 dark:placeholder:text-white/50 focus:ring-2 focus:ring-ocean/20 dark:focus:ring-white/20"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-ocean/5 dark:bg-white/10 rounded-full flex items-center justify-center text-ocean dark:text-white group-hover:bg-ocean group-hover:text-white transition-colors duration-300">
                    <Calendar className="w-5 h-5 pointer-events-none" />
                  </div>
                  <Input
                    type="text"
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => e.target.type = 'text'}
                    placeholder={t.quote?.endDate || 'Departure Date'}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="pl-16 h-14 rounded-full border-transparent bg-white dark:bg-white/10 shadow-soft hover:shadow-md focus:shadow-strong transition-all text-base text-ocean-dark dark:text-white placeholder:text-muted-foreground/70 dark:placeholder:text-white/50 focus:ring-2 focus:ring-ocean/20 dark:focus:ring-white/20"
                  />
                </div>
              </div>

              {/* Select Inputs */}
              <div className="space-y-5">
                <div className="relative">
                  <Select value={groupSize} onValueChange={setGroupSize}>
                    <SelectTrigger className="pl-16 h-14 rounded-full border-transparent bg-white dark:bg-white/10 shadow-soft hover:shadow-md focus:shadow-strong transition-all text-base text-ocean-dark dark:text-white focus:ring-2 focus:ring-ocean/20 dark:focus:ring-white/20 relative overflow-hidden group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-ocean/5 dark:bg-white/10 rounded-full flex items-center justify-center text-ocean dark:text-white group-data-[state=open]:bg-ocean group-data-[state=open]:text-white transition-colors duration-300">
                        <Users className="w-5 h-5" />
                      </div>
                      <SelectValue placeholder={t.quote?.travelers || 'Number of Travelers'} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/20 shadow-xl backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 dark:text-white">
                      <SelectItem value="1-2">1–2 Travelers</SelectItem>
                      <SelectItem value="3-5">3–5 Travelers</SelectItem>
                      <SelectItem value="6-10">6–10 Travelers</SelectItem>
                      <SelectItem value="10+">10+ Travelers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Select value={tourStyle} onValueChange={setTourStyle}>
                    <SelectTrigger className="pl-16 h-14 rounded-full border-transparent bg-white dark:bg-white/10 shadow-soft hover:shadow-md focus:shadow-strong transition-all text-base text-ocean-dark dark:text-white focus:ring-2 focus:ring-ocean/20 dark:focus:ring-white/20 relative overflow-hidden group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-ocean/5 dark:bg-white/10 rounded-full flex items-center justify-center text-ocean dark:text-white group-data-[state=open]:bg-ocean group-data-[state=open]:text-white transition-colors duration-300">
                        <Compass className="w-5 h-5" />
                      </div>
                      <SelectValue placeholder={t.quote?.tourType || 'Tour Preference'} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-white/20 shadow-xl backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 dark:text-white">
                      <SelectItem value="cultural">Cultural Heritage</SelectItem>
                      <SelectItem value="wildlife">Wildlife Safari</SelectItem>
                      <SelectItem value="beach">Beach & Relaxation</SelectItem>
                      <SelectItem value="adventure">Adventure & Hiking</SelectItem>
                      <SelectItem value="honeymoon">Luxury Honeymoon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button
                onClick={handleGetQuote}
                size="lg"
                className="w-full h-16 rounded-full text-lg font-bold bg-ocean-dark text-white hover:bg-ocean dark:hover:bg-primary shadow-lg hover:shadow-ocean/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              >
                {t.nav?.getQuote || 'Get Your Custom Quote'}
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-center text-xs text-muted-foreground dark:text-white/60 mt-3 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Usually responds within 2 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
