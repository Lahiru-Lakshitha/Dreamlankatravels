"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Compass, ArrowRight, MapPin } from 'lucide-react';
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
import { motion } from 'framer-motion';

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
    <div className="w-full relative">
      {/* Premium Glass Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl dark:shadow-glow border border-white/60 dark:border-white/10 p-8 md:p-12 overflow-hidden relative ring-1 ring-white/40 dark:ring-white/5 group/card"
      >
        {/* Animated Background Gradients - Luxury "Breathing" Effect */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-emerald-500/40 via-teal-400/30 to-transparent dark:from-emerald-500/20 dark:via-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.9, 0.7],
            rotate: [0, -30, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-orange-400/40 to-transparent dark:from-orange-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">

          {/* Left Content */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean/5 dark:bg-white/10 text-ocean dark:text-white font-bold tracking-wider uppercase text-xs border border-ocean/10 dark:border-white/10 shadow-sm relative overflow-hidden"
            >
              {/* Shimmer Effect */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
              />
              <Compass className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{t.home?.curatedExperiences || 'Plan Your Journey'}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-ocean-dark dark:text-white leading-[1.1]">
                {t.home?.readyToExplore || 'Ready to Explore \nSri Lanka?'}
              </h2>

              <p className="text-muted-foreground dark:text-white/80 text-lg leading-relaxed font-medium max-w-md">
                {t.home?.ctaSubtitle || 'Let us craft your perfect getaway. Tell us your preferences, and our experts will create a bespoke itinerary just for you.'}
              </p>
            </motion.div>
          </div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-7 bg-white/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/60 dark:border-white/10 shadow-lg ring-1 ring-white/50 dark:ring-white/5 transition-all duration-500 hover:shadow-2xl hover:bg-white/60 dark:hover:bg-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date Inputs */}
              <div className="space-y-5">
                <div className="relative group">
                  <DatePicker
                    date={arrivalDate}
                    setDate={setArrivalDate}
                    placeholder={t.quote?.startDate || 'Arrival Date'}
                    minDate={new Date()} // Prevent past dates
                  />
                </div>
                <div className="relative group">
                  <DatePicker
                    date={departureDate}
                    setDate={setDepartureDate}
                    placeholder={t.quote?.endDate || 'Departure Date'}
                    minDate={arrivalDate || new Date()} // Prevent date before arrival
                  />
                </div>
              </div>

              {/* Select Inputs */}
              <div className="space-y-5">
                <div className="relative">
                  <Select value={groupSize} onValueChange={setGroupSize}>
                    <SelectTrigger className="pl-16 h-12 rounded-xl border-transparent bg-white/80 dark:bg-white/10 shadow-sm hover:shadow-md transition-all text-sm font-medium text-ocean-dark dark:text-white relative overflow-hidden group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-ocean/10 dark:bg-white/10 rounded-lg flex items-center justify-center text-ocean dark:text-white group-data-[state=open]:bg-ocean group-data-[state=open]:text-white transition-colors duration-300">
                        <Users className="w-4 h-4" />
                      </div>
                      <SelectValue placeholder={t.quote?.travelers || 'No. of Travelers'} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-white/20 shadow-xl backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 dark:text-white">
                      <SelectItem value="1-2">1–2 Travelers</SelectItem>
                      <SelectItem value="3-5">3–5 Travelers</SelectItem>
                      <SelectItem value="6-10">6–10 Travelers</SelectItem>
                      <SelectItem value="10+">10+ Travelers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Select value={tourStyle} onValueChange={setTourStyle}>
                    <SelectTrigger className="pl-16 h-12 rounded-xl border-transparent bg-white/80 dark:bg-white/10 shadow-sm hover:shadow-md transition-all text-sm font-medium text-ocean-dark dark:text-white relative overflow-hidden group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-ocean/10 dark:bg-white/10 rounded-lg flex items-center justify-center text-ocean dark:text-white group-data-[state=open]:bg-ocean group-data-[state=open]:text-white transition-colors duration-300">
                        <Compass className="w-4 h-4" />
                      </div>
                      <SelectValue placeholder={t.quote?.tourType || 'Tour Preference'} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-white/20 shadow-xl backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 dark:text-white">
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
                className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-ocean-dark to-ocean text-white shadow-lg hover:shadow-ocean/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t.nav?.getQuote || 'Get Your Custom Quote'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-muted-foreground dark:text-white/60">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Usually responds within 2 hours
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
