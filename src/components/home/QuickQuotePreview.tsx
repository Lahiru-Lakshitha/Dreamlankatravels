"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { t } from '@/data/translations';

export function QuickQuotePreview() {
  const router = useRouter();
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [groupSize, setGroupSize] = useState('');
  const [tourStyle, setTourStyle] = useState('');

  const handleGetQuote = () => {
    const params = new URLSearchParams();
    if (arrivalDate) params.set('arrival', format(arrivalDate, 'yyyy-MM-dd'));
    if (departureDate) params.set('departure', format(departureDate, 'yyyy-MM-dd'));
    if (groupSize) params.set('travelers', groupSize);
    if (tourStyle) params.set('style', tourStyle);
    router.push(`/quote?${params.toString()}`);
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-green-100/80 via-green-50/60 to-green-100/80 dark:from-[#05110d] dark:via-[#0a1f18] dark:to-[#05110d] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-300/40 dark:via-green-900/30 to-transparent" />
      <div className="absolute -left-20 top-20 w-96 h-96 bg-green-200/40 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-20 w-96 h-96 bg-green-300/30 dark:bg-green-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-green-950 dark:text-green-50 mb-4 tracking-tight">
            {t.home?.readyToExplore || 'Craft Your Perfect Journey'}
          </h2>
          <p className="text-green-800/70 dark:text-green-200/60 text-base md:text-lg font-light leading-relaxed">
            Tell us your preferences, and we will curate a bespoke Sri Lanka experience just for you.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl mx-auto bg-[#e8f5e9]/95 dark:bg-[#0c2b1e]/90 backdrop-blur-md rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-green-900/10 border border-green-100/50 dark:border-white/5 relative">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Date Inputs */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-green-800 dark:text-green-200 ml-1">Arrival</label>
              <DatePicker
                date={arrivalDate}
                setDate={setArrivalDate}
                placeholder="Select Date"
                minDate={new Date()}
                className='h-12 w-full rounded-xl border-green-100 dark:border-white/10 bg-white dark:bg-black/20 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all hover:border-green-300 dark:hover:border-green-700/50 shadow-sm text-green-900 dark:text-green-100 placeholder:text-green-900/30 dark:placeholder:text-green-100/30'
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-green-800 dark:text-green-200 ml-1">Departure</label>
              <DatePicker
                date={departureDate}
                setDate={setDepartureDate}
                placeholder="Select Date"
                minDate={arrivalDate || new Date()}
                className='h-12 w-full rounded-xl border-green-100 dark:border-white/10 bg-white dark:bg-black/20 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all hover:border-green-300 dark:hover:border-green-700/50 shadow-sm text-green-900 dark:text-green-100 placeholder:text-green-900/30 dark:placeholder:text-green-100/30'
              />
            </div>

            {/* Selects */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-green-800 dark:text-green-200 ml-1">Travelers</label>
              <Select value={groupSize} onValueChange={setGroupSize}>
                <SelectTrigger className="h-12 w-full rounded-xl border-green-100 dark:border-white/10 bg-white dark:bg-black/20 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all hover:border-green-300 dark:hover:border-green-700/50 shadow-sm text-green-900 dark:text-green-100" translate="no">
                  <SelectValue placeholder="Group Size" className="placeholder:text-green-900/30" />
                </SelectTrigger>
                <SelectContent translate="no">
                  <SelectItem value="1-2">1–2 People</SelectItem>
                  <SelectItem value="3-5">3–5 People</SelectItem>
                  <SelectItem value="6-10">6–10 People</SelectItem>
                  <SelectItem value="10+">10+ Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-green-800 dark:text-green-200 ml-1">Style</label>
              <Select value={tourStyle} onValueChange={setTourStyle}>
                <SelectTrigger className="h-12 w-full rounded-xl border-green-100 dark:border-white/10 bg-white dark:bg-black/20 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all hover:border-green-300 dark:hover:border-green-700/50 shadow-sm text-green-900 dark:text-green-100" translate="no">
                  <SelectValue placeholder="Preference" className="placeholder:text-green-900/30" />
                </SelectTrigger>
                <SelectContent translate="no">
                  <SelectItem value="cultural">Heritage & Culture</SelectItem>
                  <SelectItem value="wildlife">Wildlife Safari</SelectItem>
                  <SelectItem value="beach">Beach Relaxation</SelectItem>
                  <SelectItem value="luxury">Ultra Luxury</SelectItem>
                  <SelectItem value="honeymoon">Romantic Honeymoon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Button
              onClick={handleGetQuote}
              size="lg"
              className="w-full md:w-auto min-w-[240px] h-14 rounded-full text-base font-semibold bg-[#1a4a3b] hover:bg-[#143d30] text-white shadow-xl shadow-[#1a4a3b]/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Get My Free Quote <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
