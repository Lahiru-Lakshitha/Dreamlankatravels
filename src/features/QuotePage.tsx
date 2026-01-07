"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useSearchParams } from 'next/navigation';
import {
  Calendar, Users, MapPin, Send, CheckCircle, Loader2,
  User, Mail, Phone, Globe, Compass, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageHeroStrip } from '@/components/layout/PageHeroStrip';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email').max(255),
  phone: z.string().min(5, 'Please enter a valid phone number').max(20),
  country: z.string().min(1, 'Please select your country'),
  startDate: z.string().min(1, 'Please select a start date'),
  endDate: z.string().min(1, 'Please select an end date'),
  travelers: z.string().min(1, 'Please specify number of travelers'),
  budget: z.string().min(1, 'Please select a budget range'),
  tourType: z.string().min(1, 'Please select a tour type'),
  specialRequests: z.string().max(1000).optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const countries = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Italy',
  'Spain', 'Australia', 'Canada', 'Japan', 'China', 'India', 'Russia', 'Other'
];

const budgetRanges = [
  'Under $1,000', '$1,000 - $2,000', '$2,000 - $5,000', '$5,000 - $10,000', '$10,000+'
];

const destinations = [
  'Sigiriya', 'Kandy', 'Galle', 'Ella', 'Yala', 'Mirissa',
  'Nuwara Eliya', 'Anuradhapura', 'Trincomalee', 'Jaffna'
];

const groupSizeOptions = [
  { value: '1-2', label: '1–2 Travelers' },
  { value: '3-5', label: '3–5 Travelers' },
  { value: '6-10', label: '6–10 Travelers' },
  { value: '10+', label: '10+ Travelers' },
];

export default function QuotePage() {
  const searchParams = useSearchParams();
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const tourTypes = [
    t.quote.culturalHeritage, t.quote.wildlifeSafari, t.quote.beachHoliday, t.quote.adventure,
    t.quote.honeymoon, t.quote.family, t.quote.photography, t.quote.wellness, t.quote.custom
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      country: '',
    },
  });

  // Pre-fill form with user data and URL params
  useEffect(() => {
    if (profile) {
      setValue('fullName', profile.full_name || '');
      setValue('email', profile.email || user?.email || '');
      setValue('phone', profile.phone || '');
      setValue('country', profile.country || '');
    } else if (user) {
      setValue('email', user.email || '');
    }

    // Pre-fill from URL params (from QuickQuotePreview)
    const arrival = searchParams.get('arrival');
    const departure = searchParams.get('departure');
    const travelers = searchParams.get('travelers');
    const style = searchParams.get('style');

    if (arrival) setValue('startDate', arrival);
    if (departure) setValue('endDate', departure);
    if (travelers) setValue('travelers', travelers);
    if (style) setValue('tourType', style);
  }, [profile, user, setValue, searchParams]);

  const toggleDestination = (dest: string) => {
    setSelectedDestinations(prev =>
      prev.includes(dest)
        ? prev.filter(d => d !== dest)
        : [...prev, dest]
    );
  };

  const onSubmit = async (data: QuoteFormData) => {
    const { error } = await supabase.from('quotes').insert([
      {
        user_id: user?.id || null,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        travel_start_date: data.startDate,
        travel_end_date: data.endDate,
        travelers: parseInt(data.travelers) || 1,
        budget_range: data.budget,
        tour_type: data.tourType,
        destinations: selectedDestinations.length > 0 ? selectedDestinations : null,
        special_requests: data.specialRequests || null,
        status: 'pending' as const,
      },
    ]);

    if (error) {
      toast({
        title: t.common.error,
        description: t.quote.submitError,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t.quote.submitSuccess,
        description: t.quote.submitSuccessDesc,
      });
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedDestinations([]);
    reset();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[hsl(var(--quote-bg))]">
        <MetaTags
          title={t.quote.submitSuccess}
          description={t.quote.submitSuccessDesc}
        />
        <div className="text-center max-w-md mx-auto px-4 animate-fade-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            {t.quote.thankYou}
          </h1>
          <p className="text-muted-foreground mb-8">
            {t.quote.thankYouDesc}
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={handleReset}
            className="bg-primary hover:bg-primary/90 rounded-xl"
          >
            {t.quote.submitAnother}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <MetaTags
        title={t.quote.pageTitle}
        description={t.quote.pageDescription}
      />

      {/* Hero Strip */}
      <PageHeroStrip
        accentLabel={t.quote.startYourJourney}
        title={t.quote.requestQuote}
        subtitle={t.quote.heroSubtitle}
      />

      {/* Form Section */}
      <section className="py-10 sm:py-14 relative z-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Section 1: Traveler Information */}
              <div className="bg-card rounded-3xl shadow-lg border border-border/20 p-6 sm:p-8 animate-fade-up transition-shadow hover:shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Traveler Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">{t.quote.fullName} *</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        {...register('fullName')}
                        className={`pl-10 h-12 rounded-xl border-border/60 ${errors.fullName ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-destructive text-sm">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">{t.quote.email} *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        className={`pl-10 h-12 rounded-xl border-border/60 ${errors.email ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-destructive text-sm">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">{t.quote.phone} *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1 234 567 890"
                        {...register('phone')}
                        className={`pl-10 h-12 rounded-xl border-border/60 ${errors.phone ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-destructive text-sm">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">{t.quote.country} *</Label>
                    <Select onValueChange={(value) => setValue('country', value)}>
                      <SelectTrigger className={`h-12 rounded-xl border-border/60 ${errors.country ? 'border-destructive' : ''}`}>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <SelectValue placeholder={t.quote.selectCountry} />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && (
                      <p className="text-destructive text-sm">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                {/* WhatsApp Question */}
                <div className="pt-4 mt-4 border-t border-border/30">
                  <Label className="text-sm font-medium mb-3 block">Are you on WhatsApp with this number?</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="whatsapp"
                        value="yes"
                        defaultChecked
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-foreground">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="whatsapp"
                        value="no"
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-foreground">No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Travel Dates */}
              <div className="bg-card rounded-3xl shadow-lg border border-border/20 p-6 sm:p-8 animate-fade-up transition-shadow hover:shadow-xl" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Travel Dates
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-sm font-medium">{t.quote.startDate} *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="startDate"
                        type="date"
                        {...register('startDate')}
                        className={`pl-10 h-12 rounded-xl border-border/60 ${errors.startDate ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.startDate && (
                      <p className="text-destructive text-sm">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-sm font-medium">{t.quote.endDate} *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="endDate"
                        type="date"
                        {...register('endDate')}
                        className={`pl-10 h-12 rounded-xl border-border/60 ${errors.endDate ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.endDate && (
                      <p className="text-destructive text-sm">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Tour Preferences */}
              <div className="bg-card rounded-3xl shadow-lg border border-border/20 p-6 sm:p-8 animate-fade-up transition-shadow hover:shadow-xl" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Tour Preferences
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="travelers" className="text-sm font-medium">Group Size *</Label>
                    <Select onValueChange={(value) => setValue('travelers', value)}>
                      <SelectTrigger className={`h-12 rounded-xl border-border/60 ${errors.travelers ? 'border-destructive' : ''}`}>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <SelectValue placeholder="Select group size" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {groupSizeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.travelers && (
                      <p className="text-destructive text-sm">{errors.travelers.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-sm font-medium">{t.quote.budget} *</Label>
                    <Select onValueChange={(value) => setValue('budget', value)}>
                      <SelectTrigger className={`h-12 rounded-xl border-border/60 ${errors.budget ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder={t.quote.selectBudget} />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map(range => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.budget && (
                      <p className="text-destructive text-sm">{errors.budget.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="tourType" className="text-sm font-medium">{t.quote.tourType} *</Label>
                    <Select onValueChange={(value) => setValue('tourType', value)}>
                      <SelectTrigger className={`h-12 rounded-xl border-border/60 ${errors.tourType ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder={t.quote.selectTourType} />
                      </SelectTrigger>
                      <SelectContent>
                        {tourTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tourType && (
                      <p className="text-destructive text-sm">{errors.tourType.message}</p>
                    )}
                  </div>
                </div>

                {/* Destinations */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium">{t.quote.preferredDestinations}</Label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {destinations.map(dest => (
                      <div
                        key={dest}
                        onClick={() => toggleDestination(dest)}
                        className={`flex items-center justify-center px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 ${selectedDestinations.includes(dest)
                          ? 'bg-primary/10 border-primary text-primary font-medium'
                          : 'bg-background border-border/60 text-foreground hover:border-primary/50'
                          }`}
                      >
                        <span className="text-sm">{dest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 4: Special Requests */}
              <div className="bg-card rounded-3xl shadow-lg border border-border/20 p-6 sm:p-8 animate-fade-up transition-shadow hover:shadow-xl" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {t.quote.specialRequests}
                  </h2>
                </div>

                <Textarea
                  placeholder={t.quote.specialRequestsPlaceholder}
                  rows={4}
                  {...register('specialRequests')}
                  className="resize-none rounded-xl border-border/60"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="min-w-[280px] h-14 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {t.quote.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Request My Luxury Sri Lanka Quote
                    </>
                  )}
                </Button>
                <p className="text-muted-foreground text-sm mt-4">
                  {t.quote.responseTime}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border/50 sm:hidden z-50">
        <Button
          type="button"
          onClick={() => document.querySelector('form')?.requestSubmit()}
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Get My Quote'
          )}
        </Button>
      </div>
    </div>
  );
}
