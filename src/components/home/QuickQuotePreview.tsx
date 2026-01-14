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
    <section className="relative py-12 md:py-20 bg-white dark:bg-[#05110d] md:overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F3D2E] dark:text-white mb-6 tracking-tight">
            {t.home?.readyToExplore || 'Ready to Explore Sri Lanka?'}
          </h2>
          <p className="text-[#4F7A68] dark:text-green-200/70 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Tell us your preferences, and we will curate a bespoke Sri Lanka experience just for you.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-6xl mx-auto bg-[#114F3E] dark:bg-[#0c2b1e] rounded-[24px] p-6 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:shadow-none border border-[#114F3E]/30 dark:border-white/5">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">

            {/* Date Inputs */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 dark:text-green-200 ml-1">Arrival</label>
              <div className="relative group">
                <DatePicker
                  date={arrivalDate}
                  setDate={setArrivalDate}
                  placeholder="Select Date"
                  minDate={new Date()}
                  className='h-[46px] w-full rounded-xl border-transparent hover:border-white/50 hover:bg-gray-50 dark:border-white/10 bg-white dark:bg-black/20 text-sm focus:border-white/80 focus:ring-2 focus:ring-white/20 transition-all shadow-sm text-[#0F3D2E] dark:text-green-100 placeholder:text-[#4F7A68]/50 dark:placeholder:text-green-100/30 px-3'
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 dark:text-green-200 ml-1">Departure</label>
              <div className="relative group">
                <DatePicker
                  date={departureDate}
                  setDate={setDepartureDate}
                  placeholder="Select Date"
                  minDate={arrivalDate || new Date()}
                  className='h-[46px] w-full rounded-xl border-transparent hover:border-white/50 hover:bg-gray-50 dark:border-white/10 bg-white dark:bg-black/20 text-sm focus:border-white/80 focus:ring-2 focus:ring-white/20 transition-all shadow-sm text-[#0F3D2E] dark:text-green-100 placeholder:text-[#4F7A68]/50 dark:placeholder:text-green-100/30 px-3'
                />
              </div>
            </div>

            {/* Selects */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 dark:text-green-200 ml-1">Travelers</label>
              <Select value={groupSize} onValueChange={setGroupSize}>
                <SelectTrigger className="h-[46px] w-full rounded-xl border-transparent hover:border-white/50 hover:bg-gray-50 dark:border-white/10 bg-white dark:bg-black/20 text-sm focus:border-white/80 focus:ring-2 focus:ring-white/20 transition-all shadow-sm text-[#0F3D2E] dark:text-green-100 px-3" translate="no">
                  <SelectValue placeholder="Group Size" className="placeholder:text-[#4F7A68]/50" />
                </SelectTrigger>
                <SelectContent translate="no">
                  <SelectItem value="1-2">1–2 People</SelectItem>
                  <SelectItem value="3-5">3–5 People</SelectItem>
                  <SelectItem value="6-10">6–10 People</SelectItem>
                  <SelectItem value="10+">10+ Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 dark:text-green-200 ml-1">Style</label>
              <Select value={tourStyle} onValueChange={setTourStyle}>
                <SelectTrigger className="h-[46px] w-full rounded-xl border-transparent hover:border-white/50 hover:bg-gray-50 dark:border-white/10 bg-white dark:bg-black/20 text-sm focus:border-white/80 focus:ring-2 focus:ring-white/20 transition-all shadow-sm text-[#0F3D2E] dark:text-green-100 px-3" translate="no">
                  <SelectValue placeholder="Preference" className="placeholder:text-[#4F7A68]/50" />
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

          <div className="mt-8 md:mt-10 flex justify-center">
            <Button
              onClick={handleGetQuote}
              size="lg"
              className="w-full md:w-auto min-w-[240px] h-[48px] rounded-full text-base font-bold bg-[#0F3D2E] text-white shadow-lg border border-white hover:bg-white hover:text-[#0F3D2E] hover:shadow-xl hover:-translate-y-[1px] transition-all duration-300"
            >
              Get My Free Quote <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
