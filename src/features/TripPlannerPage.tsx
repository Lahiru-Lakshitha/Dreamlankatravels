"use client";

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { Calendar, DollarSign, Clock, Compass, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { TourCard } from '@/components/tours/TourCard';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageHeroStrip } from '@/components/layout/PageHeroStrip';
import { ContentLoading } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { submitTripPlan } from '@/app/actions/forms';

interface Tour {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  duration: string | null;
  price: number | null;
  image_url: string | null;
  rating: number | null;
  review_count: number | null;
  tour_type: string | null;
  destinations: string[] | null;
  highlights: string[] | null;
  featured: boolean | null;
  group_size_max: number | null;
}

interface Preferences {
  startDate: string;
  endDate: string;
  budget: number[];
  duration: string;
  interests: string[];
}

const INTERESTS = [
  { id: 'cultural', label: 'Cultural & Heritage', icon: '🏛️' },
  { id: 'beach', label: 'Beach & Coastal', icon: '🏖️' },
  { id: 'wildlife', label: 'Wildlife Safari', icon: '🦁' },
  { id: 'adventure', label: 'Adventure', icon: '🏔️' },
  { id: 'honeymoon', label: 'Honeymoon', icon: '💕' },
  { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' },
];

const DURATIONS = [
  { value: '', label: 'Any Duration' },
  { value: '1-3', label: '1-3 Days' },
  { value: '4-7', label: '4-7 Days' },
  { value: '8-14', label: '8-14 Days' },
  { value: '15+', label: '15+ Days' },
];

// Rule-based recommendation engine (designed for future AI replacement)
function getRecommendations(tours: Tour[], preferences: Preferences): { tour: Tour; reasons: string[] }[] {
  const results: { tour: Tour; score: number; reasons: string[] }[] = [];

  tours.forEach(tour => {
    let score = 0;
    const reasons: string[] = [];

    // Match tour type to interests
    if (preferences.interests.length > 0) {
      const tourType = tour.tour_type?.toLowerCase() || '';
      if (preferences.interests.some(interest => tourType.includes(interest))) {
        score += 30;
        reasons.push('Matches your interests');
      }
    }

    // Budget matching
    const tourPrice = tour.price || 0;
    const [minBudget, maxBudget] = preferences.budget;
    if (tourPrice >= minBudget && tourPrice <= maxBudget) {
      score += 25;
      reasons.push('Within your budget');
    } else if (tourPrice < minBudget) {
      score += 15;
      reasons.push('Under budget');
    }

    // Duration matching
    if (preferences.duration) {
      const durationDays = parseInt(tour.duration || '0');
      const [minDays, maxDays] = preferences.duration.includes('+')
        ? [parseInt(preferences.duration), 100]
        : preferences.duration.split('-').map(Number);

      if (durationDays >= minDays && durationDays <= maxDays) {
        score += 20;
        reasons.push('Perfect duration');
      }
    }

    // Rating bonus
    if (tour.rating && tour.rating >= 4.5) {
      score += 15;
      reasons.push('Highly rated');
    }

    // Review count bonus (popular tours)
    if (tour.review_count && tour.review_count > 50) {
      score += 10;
      reasons.push('Popular choice');
    }

    if (score > 0 || preferences.interests.length === 0) {
      results.push({ tour, score, reasons: reasons.length > 0 ? reasons : ['Great destination'] });
    }
  });

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ tour, reasons }) => ({ tour, reasons }));
}

export default function TripPlannerPage() {
  const { t } = useLanguage();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<{ tour: Tour; reasons: string[] }[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [preferences, setPreferences] = useState<Preferences>({
    startDate: '',
    endDate: '',
    budget: [0, 5000],
    duration: '',
    interests: [],
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    const { data, error } = await supabase
      .from('tours')
      .select('id, slug, name, short_description, duration, price, image_url, rating, review_count, tour_type, destinations, highlights, featured, group_size_max');

    if (data && !error) {
      setTours(data);
    }
    setIsLoading(false);
  };

  const handleInterestToggle = (interestId: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };



  const handleSearch = async () => {
    setIsSearching(true);

    // Save the plan to backend for analytics/lead gen
    const formData = new FormData();
    formData.append("budgetMin", preferences.budget[0].toString());
    formData.append("budgetMax", preferences.budget[1].toString());
    if (preferences.startDate) formData.append("startDate", preferences.startDate);
    if (preferences.endDate) formData.append("endDate", preferences.endDate);
    if (preferences.duration) formData.append("duration", preferences.duration);
    if (preferences.interests.length > 0) {
      formData.append("interests", JSON.stringify(preferences.interests));
    }

    // Fire and forget, or await? Await to ensure save.
    await submitTripPlan(formData);

    // Simulate AI processing delay for future-ready experience
    setTimeout(() => {
      const results = getRecommendations(tours, preferences);
      setRecommendations(results);
      setHasSearched(true);
      setIsSearching(false);
    }, 800);
  };

  const handleReset = () => {
    setPreferences({
      startDate: '',
      endDate: '',
      budget: [0, 5000],
      duration: '',
      interests: [],
    });
    setRecommendations([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-[#F4F7F5] dark:bg-background">
      <MetaTags
        title="Trip Planner | Plan Your Sri Lanka Adventure"
        description="Plan your perfect Sri Lanka trip with our smart recommendation system. Tell us your preferences and get personalized tour suggestions."
      />

      {/* Hero Strip */}
      <PageHeroStrip
        accentLabel="Smart Trip Planner"
        title="Plan Your Perfect Sri Lanka Trip"
        subtitle="Tell us your preferences and we'll recommend the best tours for your dream vacation."
      />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
          {/* Preferences Panel - Premium Trip Planner Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-white/5 backdrop-blur-md rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:shadow-glow border border-white/60 dark:border-white/10 p-6 sticky top-24 transition-all duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)]">

              {/* Header */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-black/5 dark:border-white/10">
                <div className="w-10 h-10 rounded-full bg-emerald-100/50 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-ocean-dark dark:text-white leading-tight">Design Your Journey</h2>
                  <p className="text-xs text-muted-foreground dark:text-white/60 font-medium">Customize your Sri Lanka experience</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Travel Dates Group */}
                <div className="bg-[#F8FBFA] dark:bg-white/5 rounded-2xl p-4 space-y-3">
                  <Label className="text-xs font-bold text-ocean-dark dark:text-white flex items-center gap-2 uppercase tracking-wide">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    Travel Dates
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-muted-foreground/80 dark:text-white/50 font-semibold ml-1 block">Start</Label>
                      <DatePicker
                        date={preferences.startDate ? parse(preferences.startDate, 'yyyy-MM-dd', new Date()) : undefined}
                        setDate={(date) => setPreferences({ ...preferences, startDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                        placeholder="Start Date"
                        minDate={new Date()}
                        className="h-10 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-muted-foreground/80 dark:text-white/50 font-semibold ml-1 block">End</Label>
                      <DatePicker
                        date={preferences.endDate ? parse(preferences.endDate, 'yyyy-MM-dd', new Date()) : undefined}
                        setDate={(date) => setPreferences({ ...preferences, endDate: date ? format(date, 'yyyy-MM-dd') : '' })}
                        placeholder="End Date"
                        minDate={preferences.startDate ? parse(preferences.startDate, 'yyyy-MM-dd', new Date()) : new Date()}
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget Group */}
                <div className="bg-[#F8FBFA] dark:bg-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold text-ocean-dark dark:text-white flex items-center gap-2 uppercase tracking-wide">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      Budget Per Person
                    </Label>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                      ${preferences.budget[0]} - ${preferences.budget[1]}
                    </span>
                  </div>
                  <div className="px-1">
                    <Slider
                      value={preferences.budget}
                      onValueChange={(value) => setPreferences({ ...preferences, budget: value })}
                      min={0}
                      max={5000}
                      step={100}
                      className="cursor-pointer py-2"
                    />
                  </div>
                </div>

                {/* Duration Group */}
                <div className="bg-[#F8FBFA] dark:bg-white/5 rounded-2xl p-4 space-y-3">
                  <Label className="text-xs font-bold text-ocean-dark dark:text-white flex items-center gap-2 uppercase tracking-wide">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    Duration
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`cursor-pointer text-xs font-semibold py-2 px-3 rounded-full text-center transition-all duration-300 ${preferences.duration === ''
                        ? 'bg-emerald-600 text-white shadow-md transform -translate-y-0.5'
                        : 'bg-white dark:bg-white/10 text-muted-foreground dark:text-white/70 hover:bg-emerald-50 dark:hover:bg-white/20 hover:text-emerald-700 dark:hover:text-white'}`}
                      onClick={() => setPreferences({ ...preferences, duration: '' })}
                    >
                      Any
                    </div>
                    {DURATIONS.filter(d => d.value !== '').map(d => (
                      <div
                        key={d.value}
                        className={`cursor-pointer text-xs font-semibold py-2 px-3 rounded-full text-center transition-all duration-300 ${preferences.duration === d.value
                          ? 'bg-emerald-600 text-white shadow-md transform -translate-y-0.5'
                          : 'bg-white dark:bg-white/10 text-muted-foreground dark:text-white/70 hover:bg-emerald-50 dark:hover:bg-white/20 hover:text-emerald-700 dark:hover:text-white'}`}
                        onClick={() => setPreferences({ ...preferences, duration: d.value })}
                      >
                        {d.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interests Group */}
                <div className="bg-[#F8FBFA] dark:bg-white/5 rounded-2xl p-4 space-y-3">
                  <Label className="text-xs font-bold text-ocean-dark dark:text-white flex items-center gap-2 uppercase tracking-wide">
                    <Compass className="w-3.5 h-3.5 text-emerald-500" />
                    Interests
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {INTERESTS.map(interest => (
                      <div
                        key={interest.id}
                        className={`group cursor-pointer flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all duration-300 ${preferences.interests.includes(interest.id)
                          ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm'
                          : 'border-transparent bg-white dark:bg-white/10 text-muted-foreground/70 dark:text-white/60 hover:text-ocean-dark dark:hover:text-white hover:scale-105 hover:bg-white dark:hover:bg-white/20 hover:shadow-sm'
                          }`}
                        onClick={() => handleInterestToggle(interest.id)}
                      >
                        <span className="text-lg filter grayscale group-hover:grayscale-0 transition-all">{interest.icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-tight text-center leading-tight line-clamp-1">
                          {interest.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <Button
                    size="lg"
                    className="w-full h-12 rounded-full text-sm uppercase tracking-widest font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-300"
                    onClick={handleSearch}
                    disabled={isSearching || isLoading}
                  >
                    {isSearching ? (
                      <>Finding Trips...</>
                    ) : (
                      <>
                        Get Recommendations
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs text-muted-foreground hover:text-ocean-dark dark:text-white/40 dark:hover:text-white"
                    onClick={handleReset}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <ContentLoading text="Loading tours..." />
            ) : !hasSearched ? (
              <div className="text-center py-20">
                <Compass className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">Ready to Explore?</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Set your preferences and click "Get Recommendations" to discover perfect tours for your Sri Lanka adventure.
                </p>
              </div>
            ) : isSearching ? (
              <ContentLoading text="Finding the best tours for you..." />
            ) : recommendations.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="font-serif text-2xl font-bold mb-2">No Matches Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your preferences to find more options.
                </p>
                <Link href="/tours">
                  <Button variant="ocean">Browse All Tours</Button>
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl font-bold">
                    Recommended for You
                  </h2>
                  <Badge variant="secondary" className="text-sm">
                    {recommendations.length} tours found
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map(({ tour, reasons }) => (
                    <div key={tour.id} className="relative">
                      <TourCard tour={tour} />
                      {/* Recommendation reasons */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {reasons.map((reason, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs bg-sunset/5 border-sunset/20 text-sunset-dark"
                          >
                            ✓ {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link href="/quote">
                    <Button variant="gold" size="lg">
                      Request Custom Quote
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
