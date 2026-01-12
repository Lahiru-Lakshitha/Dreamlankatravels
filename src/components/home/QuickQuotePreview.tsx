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
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            {t.home?.readyToExplore || 'Craft Your Perfect Journey'}
          </h2>
          <p className="text-muted-foreground text-lg">
            Tell us your preferences, and we will curate a bespoke Sri Lanka experience just for you.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#03140e] rounded-3xl p-6 md:p-10 shadow-xl border border-border/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Date Inputs */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Arrival</label>
              <DatePicker
                date={arrivalDate}
                setDate={setArrivalDate}
                placeholder="Select Date"
                minDate={new Date()}
                className='h-12'
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Departure</label>
              <DatePicker
                date={departureDate}
                setDate={setDepartureDate}
                placeholder="Select Date"
                minDate={arrivalDate || new Date()}
                className='h-12'
              />
            </div>

            {/* Selects */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Travelers</label>
              <Select value={groupSize} onValueChange={setGroupSize}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/10 border-border/50">
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

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Style</label>
              <Select value={tourStyle} onValueChange={setTourStyle}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/10 border-border/50">
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
              className="w-full md:w-auto min-w-[240px] h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary-hover text-white shadow-lg transition-transform hover:scale-[1.02]"
            >
              Get My Free Quote <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
