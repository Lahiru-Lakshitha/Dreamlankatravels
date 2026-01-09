"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import {
  ArrowLeft, Clock, Users, Star, MapPin,
  Check, X, Share2, Heart,
  Globe, Languages, Mountain, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MetaTags } from '@/components/seo/MetaTags';
import { BookingForm } from '@/components/booking/BookingForm';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewSummary } from '@/components/reviews/ReviewSummary';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { TourMap } from '@/components/tours/TourMap';
import { FAQPreview } from '@/components/faq/FAQPreview';
import { PageLoading } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

// Default images
import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';

interface Tour {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  short_description: string | null;
  duration: string | null;
  price: number | null;
  image_url: string | StaticImageData | null;
  rating: number | null;
  review_count: number | null;
  tour_type: string | null;
  destinations: string[] | null;
  highlights: string[] | null;
  featured: boolean | null;
  group_size_max: number | null;
  group_size_min: number | null;
  difficulty_level: string | null;
  min_age: number | null;
  languages: string[] | null;
  video_url: string | null;
  map_coordinates: any;
}

interface Itinerary {
  id: string;
  day_number: number;
  title: string;
  description: string | null;
  location: string | null;
  meals_included: string[] | null;
  accommodation: string | null;
  highlights: string[] | null;
}

interface Pricing {
  id: string;
  tier_name: string;
  price_per_person: number;
  currency: string;
  min_travelers: number | null;
  max_travelers: number | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
}

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_country: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  travel_date: string | null;
  is_verified: boolean | null;
  admin_response: string | null;
  created_at: string;
}

// Fallback tour data
const FALLBACK_TOURS: Record<string, Tour> = {
  'cultural-triangle-explorer': {
    id: 'fallback-1',
    slug: 'cultural-triangle-explorer',
    name: 'Cultural Triangle Explorer',
    description: `Embark on a journey through Sri Lanka's ancient heart, where towering rock fortresses, sacred temples, and centuries-old ruins tell the story of one of Asia's oldest civilizations.

This carefully crafted 7-day tour takes you through the Cultural Triangle - a UNESCO World Heritage region that encompasses the ancient capitals of Anuradhapura and Polonnaruwa, the rock fortress of Sigiriya, and the sacred city of Kandy.

Each day brings new discoveries: climb the iconic Sigiriya Rock at sunrise, explore the intricate frescoes of the Cave Temples of Dambulla, witness the ancient Buddhist ruins of Polonnaruwa, and experience the living traditions at the Temple of the Tooth in Kandy.`,
    short_description: 'Explore the ancient kingdoms of Sri Lanka through UNESCO World Heritage sites.',
    duration: '7 Days / 6 Nights',
    price: 899,
    image_url: templeImage,
    rating: 4.9,
    review_count: 124,
    tour_type: 'cultural',
    destinations: ['Colombo', 'Sigiriya', 'Dambulla', 'Polonnaruwa', 'Kandy'],
    highlights: ['Sigiriya Rock Fortress', 'Temple of the Tooth', 'Dambulla Cave Temple', 'Polonnaruwa Ruins', 'Traditional Dance Show', 'Tea Factory Visit'],
    featured: true,
    group_size_max: 12,
    group_size_min: 2,
    difficulty_level: 'moderate',
    min_age: 8,
    languages: ['English', 'German', 'French'],
    video_url: null,
    map_coordinates: null,
  },
};

const FALLBACK_ITINERARY: Itinerary[] = [
  {
    id: '1',
    day_number: 1,
    title: 'Arrival in Colombo',
    description: 'Welcome to Sri Lanka! Upon arrival at Bandaranaike International Airport, you\'ll be greeted by our representative and transferred to your hotel. After checking in and freshening up, enjoy a brief orientation followed by a welcome dinner featuring authentic Sri Lankan cuisine.',
    location: 'Colombo',
    meals_included: ['Dinner'],
    accommodation: 'Colombo City Hotel (4-star)',
    highlights: ['Airport pickup', 'Welcome dinner', 'City orientation'],
  },
  {
    id: '2',
    day_number: 2,
    title: 'Colombo to Sigiriya',
    description: 'After breakfast, depart for Sigiriya, stopping at the Pinnawala Elephant Orphanage where you can observe elephants bathing in the river. Continue to Sigiriya and check into your hotel. In the evening, enjoy a guided village tour by bullock cart.',
    location: 'Sigiriya',
    meals_included: ['Breakfast', 'Dinner'],
    accommodation: 'Sigiriya Village Hotel (4-star)',
    highlights: ['Pinnawala Elephant Orphanage', 'Village tour', 'Bullock cart ride'],
  },
  {
    id: '3',
    day_number: 3,
    title: 'Sigiriya Rock Fortress & Dambulla',
    description: 'Early morning climb of the iconic Sigiriya Rock Fortress to catch the sunrise. Explore the ancient frescoes, mirror wall, and lion paw entrance. After lunch, visit the Dambulla Cave Temple, a UNESCO site with stunning Buddhist murals.',
    location: 'Sigiriya & Dambulla',
    meals_included: ['Breakfast', 'Lunch', 'Dinner'],
    accommodation: 'Sigiriya Village Hotel (4-star)',
    highlights: ['Sigiriya Rock climb', 'Ancient frescoes', 'Dambulla Cave Temple'],
  },
  {
    id: '4',
    day_number: 4,
    title: 'Polonnaruwa Ancient City',
    description: 'Full day exploring the ancient city of Polonnaruwa, the medieval capital of Sri Lanka. Visit the Royal Palace, Gal Vihara with its stunning Buddha statues, and the Quadrangle. Bicycle rental available for a unique exploration experience.',
    location: 'Polonnaruwa',
    meals_included: ['Breakfast', 'Lunch', 'Dinner'],
    accommodation: 'Polonnaruwa Hotel (3-star)',
    highlights: ['Royal Palace ruins', 'Gal Vihara', 'Cycling through ruins'],
  },
  {
    id: '5',
    day_number: 5,
    title: 'Minneriya & Journey to Kandy',
    description: 'Morning safari at Minneriya National Park, famous for the elephant gathering. After lunch, drive to Kandy through scenic hill country. En route, visit a spice garden and learn about Ceylon spices. Evening at leisure in Kandy.',
    location: 'Kandy',
    meals_included: ['Breakfast', 'Lunch', 'Dinner'],
    accommodation: 'Kandy Heritage Hotel (4-star)',
    highlights: ['Elephant safari', 'Spice garden visit', 'Scenic drive'],
  },
  {
    id: '6',
    day_number: 6,
    title: 'Kandy Exploration',
    description: 'Full day in Kandy. Morning visit to the Royal Botanical Gardens at Peradeniya. Afternoon exploration of Kandy town including the Temple of the Tooth, Sri Lanka\'s most sacred Buddhist site. Evening Kandyan cultural dance performance.',
    location: 'Kandy',
    meals_included: ['Breakfast', 'Dinner'],
    accommodation: 'Kandy Heritage Hotel (4-star)',
    highlights: ['Temple of the Tooth', 'Botanical Gardens', 'Cultural dance show'],
  },
  {
    id: '7',
    day_number: 7,
    title: 'Departure',
    description: 'After breakfast, visit a tea factory and learn about Ceylon tea production. Then transfer to Colombo airport for your departure, taking with you memories that will last a lifetime.',
    location: 'Kandy to Colombo',
    meals_included: ['Breakfast'],
    accommodation: null,
    highlights: ['Tea factory visit', 'Airport transfer'],
  },
];

const FALLBACK_PRICING: Pricing = {
  id: '1',
  tier_name: 'Standard',
  price_per_person: 899,
  currency: 'USD',
  min_travelers: 2,
  max_travelers: 12,
  inclusions: [
    '6 nights accommodation in 3-4 star hotels',
    'Daily breakfast, 5 lunches, 6 dinners',
    'Air-conditioned private vehicle',
    'English-speaking chauffeur guide',
    'All entrance fees to sites mentioned',
    'Elephant orphanage entry',
    'Minneriya safari jeep',
    'Cultural dance show tickets',
    'Airport transfers',
    '24/7 local support',
  ],
  exclusions: [
    'International flights',
    'Travel insurance',
    'Personal expenses',
    'Tips and gratuities',
    'Alcoholic beverages',
    'Camera/video permits at some sites',
  ],
};

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const [tour, setTour] = useState<Tour | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchTourData();
    }
  }, [slug]);

  const fetchTourData = async () => {
    setIsLoading(true);
    try {
      // Fetch tour
      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (tourError) throw tourError;

      if (tourData) {
        setTour(tourData as Tour);

        // Fetch itinerary
        const { data: itineraryData } = await supabase
          .from('tour_itineraries' as any)
          .select('*')
          .eq('tour_id', tourData.id)
          .order('day_number', { ascending: true });

        if (itineraryData && (itineraryData as any[]).length > 0) {
          setItinerary(itineraryData as unknown as Itinerary[]);
        } else {
          setItinerary(FALLBACK_ITINERARY);
        }

        // Fetch pricing
        const { data: pricingData } = await supabase
          .from('tour_pricing' as any)
          .select('*')
          .eq('tour_id', tourData.id)
          .maybeSingle();

        if (pricingData) {
          setPricing(pricingData as unknown as Pricing);
        } else {
          setPricing({ ...FALLBACK_PRICING, price_per_person: tourData.price || 899 });
        }

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('tour_id', tourData.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (reviewsData) {
          setReviews(reviewsData as Review[]);
        }
      } else {
        // Use fallback data
        const fallbackTour = FALLBACK_TOURS[slug!] || FALLBACK_TOURS['cultural-triangle-explorer'];
        setTour(fallbackTour);
        setItinerary(FALLBACK_ITINERARY);
        setPricing(FALLBACK_PRICING);
      }
    } catch (error) {
      console.error('Error fetching tour:', error);
      // Use fallback on error
      const fallbackTour = FALLBACK_TOURS[slug!] || FALLBACK_TOURS['cultural-triangle-explorer'];
      setTour(fallbackTour);
      setItinerary(FALLBACK_ITINERARY);
      setPricing(FALLBACK_PRICING);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRatingDistribution = () => {
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    return distribution;
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: tour?.name,
        text: tour?.short_description || '',
        url: window.location.href,
      });
    } catch (err) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (!tour) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold mb-4">Tour Not Found</h1>
          <Link href="/tours">
            <Button variant="ocean">Back to Tours</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : tour.rating || 4.8;

  return (
    <div className="min-h-screen pt-20">
      <MetaTags
        title={`${tour.name} | Sri Lanka Tour`}
        description={tour.short_description || tour.description?.substring(0, 160) || `Experience ${tour.name} with Dream Lanka Travels`}
      />

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={tour.image_url || templeImage}
          alt={tour.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/80 via-ocean-dark/30 to-transparent" />

        {/* Back Button */}
        <Link
          href="/tours"
          className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10"
        >
          <Button variant="ghost" className="text-sand hover:text-sand/80 hover:bg-sand/10">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tours
          </Button>
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-sand hover:text-sand/80 hover:bg-sand/10"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`hover:bg-sand/10 ${isWishlisted ? 'text-red-400' : 'text-sand hover:text-sand/80'}`}
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-400' : ''}`} />
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {tour.featured && (
                <Badge className="bg-sunset text-ocean-dark">Featured</Badge>
              )}
              {tour.tour_type && (
                <Badge variant="outline" className="border-sand/50 text-sand capitalize">
                  {tour.tour_type}
                </Badge>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-sand mb-4">
              {tour.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sand/90">
              {tour.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{tour.duration}</span>
                </div>
              )}
              {tour.group_size_max && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{tour.group_size_min || 2}-{tour.group_size_max} People</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-sunset fill-sunset" />
                <span>{averageRating.toFixed(1)} ({reviews.length || tour.review_count || 0} reviews)</span>
              </div>
              {tour.destinations && tour.destinations.length > 0 && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{tour.destinations.length} Destinations</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tour Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 overflow-x-auto">
                  <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-sunset data-[state=active]:bg-transparent">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="itinerary" className="rounded-none border-b-2 border-transparent data-[state=active]:border-sunset data-[state=active]:bg-transparent">
                    Itinerary
                  </TabsTrigger>
                  <TabsTrigger value="inclusions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-sunset data-[state=active]:bg-transparent">
                    What's Included
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-sunset data-[state=active]:bg-transparent">
                    Reviews
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {tour.description || tour.short_description}
                    </p>
                  </div>

                  {/* Highlights */}
                  {tour.highlights && tour.highlights.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-serif text-xl font-bold mb-4">Tour Highlights</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {tour.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sunset/10 flex items-center justify-center shrink-0">
                              <Check className="w-4 h-4 text-sunset" />
                            </div>
                            <span className="text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Destinations */}
                  {tour.destinations && tour.destinations.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-serif text-xl font-bold mb-4">Destinations</h3>
                      <div className="flex flex-wrap gap-2">
                        {tour.destinations.map((dest, i) => (
                          <Badge key={i} variant="secondary" className="text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {dest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tour Info Grid */}
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {tour.difficulty_level && (
                      <div className="bg-muted/50 dark:bg-white/5 p-4 rounded-lg text-center border border-transparent dark:border-white/5">
                        <Mountain className="w-6 h-6 mx-auto mb-2 text-sunset" />
                        <p className="text-sm text-muted-foreground">Difficulty</p>
                        <p className="font-semibold capitalize text-foreground dark:text-white">{tour.difficulty_level}</p>
                      </div>
                    )}
                    {tour.min_age !== null && (
                      <div className="bg-muted/50 dark:bg-white/5 p-4 rounded-lg text-center border border-transparent dark:border-white/5">
                        <Users className="w-6 h-6 mx-auto mb-2 text-sunset" />
                        <p className="text-sm text-muted-foreground">Min Age</p>
                        <p className="font-semibold text-foreground dark:text-white">{tour.min_age}+ years</p>
                      </div>
                    )}
                    {tour.languages && tour.languages.length > 0 && (
                      <div className="bg-muted/50 dark:bg-white/5 p-4 rounded-lg text-center border border-transparent dark:border-white/5">
                        <Languages className="w-6 h-6 mx-auto mb-2 text-sunset" />
                        <p className="text-sm text-muted-foreground">Languages</p>
                        <p className="font-semibold text-foreground dark:text-white">{tour.languages.length} available</p>
                      </div>
                    )}
                    <div className="bg-muted/50 dark:bg-white/5 p-4 rounded-lg text-center border border-transparent dark:border-white/5">
                      <Globe className="w-6 h-6 mx-auto mb-2 text-sunset" />
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-semibold capitalize text-foreground dark:text-white">{tour.tour_type || 'Cultural'}</p>
                    </div>
                  </div>

                  {/* Interactive Map */}
                  <TourMap
                    coordinates={tour.map_coordinates}
                    tourName={tour.name}
                  />
                </TabsContent>

                {/* Itinerary Tab */}
                <TabsContent value="itinerary" className="mt-0">
                  <h3 className="font-serif text-xl font-bold mb-6">Day-by-Day Itinerary</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {itinerary.map((day) => (
                      <AccordionItem key={day.id} value={day.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 rounded-full bg-sunset flex items-center justify-center text-ocean-dark font-bold shrink-0">
                              {day.day_number}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{day.title}</p>
                              {day.location && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {day.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-16">
                          <p className="text-muted-foreground mb-4">{day.description}</p>

                          {day.highlights && day.highlights.length > 0 && (
                            <div className="mb-4">
                              <p className="font-medium text-sm mb-2">Highlights:</p>
                              <div className="flex flex-wrap gap-2">
                                {day.highlights.map((h, i) => (
                                  <Badge key={i} variant="outline">{h}</Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                            {day.meals_included && day.meals_included.length > 0 && (
                              <div>
                                <span className="font-medium text-foreground">Meals:</span>{' '}
                                {day.meals_included.join(', ')}
                              </div>
                            )}
                            {day.accommodation && (
                              <div>
                                <span className="font-medium text-foreground">Stay:</span>{' '}
                                {day.accommodation}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                {/* Inclusions Tab */}
                <TabsContent value="inclusions" className="mt-0">
                  {pricing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Inclusions */}
                      <div>
                        <h3 className="font-serif text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          What's Included
                        </h3>
                        <ul className="space-y-3">
                          {pricing.inclusions?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Exclusions */}
                      <div>
                        <h3 className="font-serif text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
                          <X className="w-5 h-5" />
                          What's Not Included
                        </h3>
                        <ul className="space-y-3">
                          {pricing.exclusions?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-0">
                  {/* Review Summary */}
                  <ReviewSummary
                    averageRating={averageRating}
                    totalReviews={reviews.length || tour.review_count || 0}
                    ratingDistribution={calculateRatingDistribution()}
                  />

                  {/* Reviews List */}
                  <div className="mt-8 space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No reviews yet. Be the first to review this tour!</p>
                      </div>
                    )}
                  </div>

                  {/* Review Form */}
                  <div className="mt-8">
                    <ReviewForm tourId={tour.id} onSuccess={fetchTourData} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Booking Card Content */}
                {showBookingForm ? (
                  <BookingForm
                    tour={{
                      id: tour.id,
                      name: tour.name,
                      price: pricing?.price_per_person || tour.price,
                      duration: tour.duration,
                      group_size_max: tour.group_size_max,
                    }}
                    onSuccess={(ref) => {
                      setShowBookingForm(false);
                    }}
                  />
                ) : (
                  <div className="bg-card dark:bg-white/5 p-6 rounded-xl shadow-lg dark:shadow-glow border border-border dark:border-white/10 transition-all duration-300">
                    <div className="text-center mb-6">
                      <p className="text-muted-foreground text-sm">From</p>
                      <p className="font-serif text-4xl font-bold text-sunset">
                        ${pricing?.price_per_person?.toLocaleString() || tour.price?.toLocaleString()}
                      </p>
                      <p className="text-muted-foreground">per person</p>
                    </div>

                    <Button
                      variant="hero"
                      size="xl"
                      className="w-full mb-4"
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book Now
                    </Button>

                    <Link
                      href={`/quote?tourName=${encodeURIComponent(tour.name)}&tourId=${tour.id}&duration=${encodeURIComponent(tour.duration || '')}&destinations=${encodeURIComponent(tour.destinations?.join(',') || '')}`}
                    >
                      <Button variant="outline" size="lg" className="w-full">
                        <Sparkles className="w-4 h-4 mr-2 text-sunset" />
                        Request Custom Quote
                      </Button>
                    </Link>

                    <div className="mt-6 pt-6 border-t border-border dark:border-white/10 space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600" />
                        Free cancellation up to 14 days before
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600" />
                        Instant confirmation
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-green-600" />
                        24/7 customer support
                      </div>
                    </div>

                    {/* FAQ Preview */}
                    <FAQPreview className="mt-4 pt-4 border-t border-border dark:border-white/10" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
