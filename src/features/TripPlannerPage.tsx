"use client";

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { Calendar, DollarSign, Clock, Compass, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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

  const handleSearch = () => {
    setIsSearching(true);
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
    <div className="min-h-screen pt-20 pb-16 bg-background">
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

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preferences Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl shadow-card sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-sunset" />
                <h2 className="font-serif text-xl font-bold">Your Preferences</h2>
              </div>

              <div className="space-y-6">
                {/* Travel Dates */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sunset" />
                    Travel Dates
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Start</Label>
                      <Input
                        type="date"
                        value={preferences.startDate}
                        onChange={(e) => setPreferences({ ...preferences, startDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">End</Label>
                      <Input
                        type="date"
                        value={preferences.endDate}
                        onChange={(e) => setPreferences({ ...preferences, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Budget Range */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-sunset" />
                    Budget per person: ${preferences.budget[0]} - ${preferences.budget[1]}
                  </Label>
                  <Slider
                    value={preferences.budget}
                    onValueChange={(value) => setPreferences({ ...preferences, budget: value })}
                    min={0}
                    max={10000}
                    step={100}
                    className="mt-2"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sunset" />
                    Duration
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {DURATIONS.map(d => (
                      <Badge
                        key={d.value}
                        variant={preferences.duration === d.value ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-sunset/10"
                        onClick={() => setPreferences({ ...preferences, duration: d.value })}
                      >
                        {d.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sunset" />
                    Your Interests
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTERESTS.map(interest => (
                      <div
                        key={interest.id}
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${preferences.interests.includes(interest.id)
                          ? 'border-sunset bg-sunset/10'
                          : 'border-border hover:border-sunset/50'
                          }`}
                        onClick={() => handleInterestToggle(interest.id)}
                      >
                        <Checkbox
                          checked={preferences.interests.includes(interest.id)}
                          onCheckedChange={() => handleInterestToggle(interest.id)}
                        />
                        <span className="text-sm">
                          {interest.icon} {interest.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleSearch}
                    disabled={isSearching || isLoading}
                  >
                    {isSearching ? (
                      <>Finding Perfect Tours...</>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Recommendations
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={handleReset}
                  >
                    Reset Preferences
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
