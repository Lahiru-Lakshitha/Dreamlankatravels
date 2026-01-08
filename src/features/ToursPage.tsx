"use client";

import { useState, useEffect, useCallback } from 'react';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageHeroStrip } from '@/components/layout/PageHeroStrip';
import { TourSearchFilters, TourFilters } from '@/components/tours/TourSearchFilters';
import { TourCard } from '@/components/tours/TourCard';
import { ContentLoading } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

// Fallback static tours
import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';

const FALLBACK_TOURS = [
  {
    id: 'fallback-1',
    slug: 'cultural-triangle-explorer',
    name: 'Cultural Triangle Explorer',
    short_description: 'Explore the ancient kingdoms of Sri Lanka through UNESCO World Heritage sites.',
    duration: '7 Days / 6 Nights',
    price: 899,
    image_url: templeImage,
    rating: 4.9,
    review_count: 124,
    tour_type: 'cultural',
    destinations: ['Colombo', 'Sigiriya', 'Kandy'],
    highlights: ['Sigiriya Rock Fortress', 'Temple of the Tooth', 'Dambulla Cave Temple'],
    featured: true,
    group_size_max: 12,
  },
  {
    id: 'fallback-2',
    slug: 'beach-paradise-getaway',
    name: 'Beach Paradise Getaway',
    short_description: 'Relax on pristine beaches and discover the charming coastal towns.',
    duration: '5 Days / 4 Nights',
    price: 699,
    image_url: beachImage,
    rating: 4.8,
    review_count: 89,
    tour_type: 'beach',
    destinations: ['Mirissa', 'Unawatuna', 'Galle'],
    highlights: ['Mirissa Beach', 'Whale Watching', 'Galle Fort'],
    featured: true,
    group_size_max: 8,
  },
  {
    id: 'fallback-3',
    slug: 'wildlife-safari-adventure',
    name: 'Wildlife Safari Adventure',
    short_description: 'Encounter elephants, leopards, and incredible wildlife in their natural habitat.',
    duration: '6 Days / 5 Nights',
    price: 999,
    image_url: wildlifeImage,
    rating: 4.9,
    review_count: 156,
    tour_type: 'wildlife',
    destinations: ['Yala', 'Udawalawe', 'Minneriya'],
    highlights: ['Yala National Park', 'Elephant Gathering', 'Leopard Spotting'],
    featured: true,
    group_size_max: 6,
  },
  {
    id: 'fallback-4',
    slug: 'hill-country-tea-trails',
    name: 'Hill Country & Tea Trails',
    short_description: 'Journey through misty mountains and lush tea plantations.',
    duration: '5 Days / 4 Nights',
    price: 749,
    image_url: trainImage,
    rating: 4.7,
    review_count: 78,
    tour_type: 'adventure',
    destinations: ['Ella', 'Nuwara Eliya', 'Kandy'],
    highlights: ['Scenic Train Ride', 'Tea Plantation Visit', 'Ella Rock Hike'],
    featured: false,
    group_size_max: 10,
  },
  {
    id: 'fallback-5',
    slug: 'complete-sri-lanka',
    name: 'Complete Sri Lanka',
    short_description: 'The ultimate Sri Lankan experience covering all highlights.',
    duration: '14 Days / 13 Nights',
    price: 1899,
    image_url: templeImage,
    rating: 5.0,
    review_count: 67,
    tour_type: 'cultural',
    destinations: ['Colombo', 'Sigiriya', 'Kandy', 'Ella', 'Yala', 'Mirissa'],
    highlights: ['Cultural Triangle', 'Hill Country', 'Wildlife Safari', 'Beach Relaxation'],
    featured: true,
    group_size_max: 8,
  },
  {
    id: 'fallback-6',
    slug: 'romantic-honeymoon',
    name: 'Romantic Honeymoon',
    short_description: 'Create unforgettable memories with your loved one.',
    duration: '8 Days / 7 Nights',
    price: 1299,
    image_url: beachImage,
    rating: 4.9,
    review_count: 45,
    tour_type: 'honeymoon',
    destinations: ['Bentota', 'Kandy', 'Nuwara Eliya'],
    highlights: ['Private Tours', 'Luxury Stays', 'Candlelit Dinners'],
    featured: false,
    group_size_max: 2,
  },
];

export default function ToursPage() {
  const { t } = useLanguage();
  const [tours, setTours] = useState<any[]>([]);
  const [filteredTours, setFilteredTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [tourTypes, setTourTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setTours(data);
        setFilteredTours(data);

        // Extract unique destinations and tour types
        const allDests = data.flatMap(t => t.destinations || []);
        setDestinations([...new Set(allDests)]);

        const allTypes = data.map(t => t.tour_type).filter(Boolean);
        setTourTypes([...new Set(allTypes)]);
      } else {
        // Use fallback data
        setTours(FALLBACK_TOURS);
        setFilteredTours(FALLBACK_TOURS);

        const allDests = FALLBACK_TOURS.flatMap(t => t.destinations || []);
        setDestinations([...new Set(allDests)]);

        const allTypes = FALLBACK_TOURS.map(t => t.tour_type).filter(Boolean) as string[];
        setTourTypes([...new Set(allTypes)]);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours(FALLBACK_TOURS);
      setFilteredTours(FALLBACK_TOURS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = useCallback((filters: TourFilters) => {
    let result = [...tours];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(tour =>
        tour.name.toLowerCase().includes(searchLower) ||
        tour.short_description?.toLowerCase().includes(searchLower) ||
        tour.destinations?.some((d: string) => d.toLowerCase().includes(searchLower))
      );
    }

    // Destination filter
    if (filters.destination) {
      result = result.filter(tour =>
        tour.destinations?.includes(filters.destination)
      );
    }

    // Tour type filter
    if (filters.tourType) {
      result = result.filter(tour => tour.tour_type === filters.tourType);
    }

    // Price filter
    result = result.filter(tour => {
      const price = tour.price || 0;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Duration filter
    if (filters.duration) {
      result = result.filter(tour => {
        const durationDays = parseInt(tour.duration?.match(/\d+/)?.[0] || '0');
        switch (filters.duration) {
          case '1-3': return durationDays >= 1 && durationDays <= 3;
          case '4-7': return durationDays >= 4 && durationDays <= 7;
          case '8-14': return durationDays >= 8 && durationDays <= 14;
          case '15+': return durationDays >= 15;
          default: return true;
        }
      });
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'duration-short':
        result.sort((a, b) => {
          const aDays = parseInt(a.duration?.match(/\d+/)?.[0] || '0');
          const bDays = parseInt(b.duration?.match(/\d+/)?.[0] || '0');
          return aDays - bDays;
        });
        break;
      case 'duration-long':
        result.sort((a, b) => {
          const aDays = parseInt(a.duration?.match(/\d+/)?.[0] || '0');
          const bDays = parseInt(b.duration?.match(/\d+/)?.[0] || '0');
          return bDays - aDays;
        });
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // featured
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredTours(result);
  }, [tours]);

  return (
    <div className="min-h-screen pt-20">
      <MetaTags
        title="Tour Packages | Sri Lanka Tours"
        description="Explore our curated Sri Lanka tour packages - cultural tours, wildlife safaris, beach holidays, and honeymoon packages. Expert-crafted itineraries from $699."
      />

      {/* Hero Strip */}
      <PageHeroStrip
        accentLabel="Curated Experiences"
        title="Tour Packages"
        subtitle="Discover our expertly crafted tour packages designed to showcase the very best of Sri Lanka. Every journey tells a story."
      />

      {/* Search & Filters */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <TourSearchFilters
            onFiltersChange={handleFiltersChange}
            destinations={destinations}
            tourTypes={tourTypes}
          />
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <ContentLoading />
          ) : filteredTours.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                {filteredTours.length} tour{filteredTours.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No tours found matching your criteria.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-ocean-dark dark:bg-black/40 border-t border-transparent dark:border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-sand mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-sand/80 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            We specialize in creating custom itineraries tailored to your preferences.
            Let us design your perfect Sri Lankan adventure.
          </p>
          <Link href="/quote">
            <Button variant="hero" size="xl" className="group">
              Request Custom Tour
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
