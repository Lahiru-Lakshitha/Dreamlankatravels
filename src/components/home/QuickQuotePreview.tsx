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
    <section className="relative py-12 md:py-20 bg-muted/20 dark:bg-background border-b border-border/5">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3 tracking-wide">
            {t.home?.readyToExplore || 'Craft Your Perfect Journey'}
          </h2>
          <p className="text-foreground/70 text-base md:text-lg font-light leading-relaxed">
            Tell us your preferences, and we will curate a bespoke Sri Lanka experience just for you.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl mx-auto bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 md:p-8 border border-primary/10 dark:border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Date Inputs */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Arrival</label>
              <DatePicker
                date={arrivalDate}
                setDate={setArrivalDate}
                placeholder="Select Date"
                minDate={new Date()}
                className='h-11 border-primary/10 focus:border-primary/30 bg-white/50 dark:bg-black/20 text-sm'
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Departure</label>
              <DatePicker
                date={departureDate}
                setDate={setDepartureDate}
                placeholder="Select Date"
                minDate={arrivalDate || new Date()}
                className='h-11 border-primary/10 focus:border-primary/30 bg-white/50 dark:bg-black/20 text-sm'
              />
            </div>

            {/* Selects */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Travelers</label>
              <Select value={groupSize} onValueChange={setGroupSize}>
                <SelectTrigger className="h-11 rounded-md bg-white/50 dark:bg-black/20 border-primary/10 focus:ring-primary/20 text-sm">
                  <SelectValue placeholder="Group Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1–2 People</SelectItem>
                  <SelectItem value="3-5">3–5 People</SelectItem>
                  <SelectItem value="6-10">6–10 People</SelectItem>
                  <SelectItem value="10+">10+ Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/80 ml-1">Style</label>
              <Select value={tourStyle} onValueChange={setTourStyle}>
                <SelectTrigger className="h-11 rounded-md bg-white/50 dark:bg-black/20 border-primary/10 focus:ring-primary/20 text-sm">
                  <SelectValue placeholder="Preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cultural">Heritage & Culture</SelectItem>
                  <SelectItem value="wildlife">Wildlife Safari</SelectItem>
                  <SelectItem value="beach">Beach Relaxation</SelectItem>
                  <SelectItem value="luxury">Ultra Luxury</SelectItem>
                  <SelectItem value="honeymoon">Romantic Honeymoon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleGetQuote}
              size="lg"
              className="w-full md:w-auto min-w-[200px] h-12 rounded-full text-base font-semibold bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md transition-all duration-300"
            >
              Get My Free Quote <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
