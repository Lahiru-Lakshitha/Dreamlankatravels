import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import Link from 'next/link';

interface Review {
  id: string;
  reviewer_name: string;
  reviewer_country: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  travel_date: string | null;
  platform: string | null;
  created_at: string;
}

// Fallback demo testimonials
const demoTestimonials: Review[] = [
  {
    id: 'demo-1',
    reviewer_name: 'Sarah Mitchell',
    reviewer_country: 'United Kingdom',
    rating: 5,
    title: 'Absolutely magical experience!',
    content: 'From the moment we landed, Dream Lanka Travels took care of everything. The attention to detail, local insights, and genuine care for our experience made this the best trip we\'ve ever taken.',
    travel_date: '2024-11-15',
    platform: 'tripadvisor',
    created_at: '2024-11-20',
  },
  {
    id: 'demo-2',
    reviewer_name: 'Michael Chen',
    reviewer_country: 'United States',
    rating: 5,
    title: 'Beyond our expectations',
    content: 'The cultural tour was incredible. Our guide knew every hidden gem and local story. The accommodations were perfect and the itinerary was balanced beautifully.',
    travel_date: '2024-10-20',
    platform: 'google',
    created_at: '2024-10-25',
  },
  {
    id: 'demo-3',
    reviewer_name: 'Emma Larsson',
    reviewer_country: 'Sweden',
    rating: 5,
    title: 'A honeymoon to remember forever',
    content: 'We chose Dream Lanka Travels for our honeymoon and it was the best decision. Every romantic dinner, private tour, and special moment was perfectly arranged.',
    travel_date: '2024-09-10',
    platform: 'tripadvisor',
    created_at: '2024-09-15',
  },
  {
    id: 'demo-4',
    reviewer_name: 'James Wilson',
    reviewer_country: 'Australia',
    rating: 5,
    title: 'Professional and personal service',
    content: 'The team understood exactly what we wanted. From wildlife safaris to beach relaxation, every day was perfectly planned. Highly recommend!',
    travel_date: '2024-08-05',
    platform: 'google',
    created_at: '2024-08-10',
  },
  {
    id: 'demo-5',
    reviewer_name: 'Sophie Dubois',
    reviewer_country: 'France',
    rating: 5,
    title: 'Exceptionally organized trip',
    content: 'The logistics were flawless. Punctual pickups, excellent hotels, and knowledgeable guides. Sri Lanka exceeded all my expectations thanks to this team.',
    travel_date: '2024-07-20',
    platform: 'tripadvisor',
    created_at: '2024-07-25',
  },
  {
    id: 'demo-6',
    reviewer_name: 'Thomas Mueller',
    reviewer_country: 'Germany',
    rating: 5,
    title: 'Best travel experience ever',
    content: 'We\'ve traveled extensively but this trip stands out. The authenticity, the food, the people - everything was curated with such care and expertise.',
    travel_date: '2024-06-15',
    platform: 'google',
    created_at: '2024-06-20',
  },
];

// TripAdvisor Logo SVG
const TripAdvisorLogo = () => (
  <svg viewBox="0 0 100 20" className="h-5 w-auto">
    <circle cx="10" cy="10" r="8" fill="#00AF87" />
    <circle cx="10" cy="8" r="3" fill="white" />
    <path d="M7 12 L10 16 L13 12" fill="white" />
    <text x="22" y="14" fill="currentColor" fontSize="10" fontWeight="600">TripAdvisor</text>
  </svg>
);

// Google Logo SVG
const GoogleLogo = () => (
  <svg viewBox="0 0 60 20" className="h-5 w-auto">
    <text x="0" y="15" fontSize="14" fontWeight="500">
      <tspan fill="#4285F4">G</tspan>
      <tspan fill="#EA4335">o</tspan>
      <tspan fill="#FBBC05">o</tspan>
      <tspan fill="#4285F4">g</tspan>
      <tspan fill="#34A853">l</tspan>
      <tspan fill="#EA4335">e</tspan>
    </text>
  </svg>
);

// Platform trust block component
const PlatformTrustBlock = ({
  platform,
  reviewCount
}: {
  platform: 'tripadvisor' | 'google';
  reviewCount: number;
}) => {
  const isTripAdvisor = platform === 'tripadvisor';

  return (
    <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/30 shadow-soft">
      <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        Excellent
      </span>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 fill-current ${isTripAdvisor ? 'text-[#00AF87]' : 'text-[#FBBC05]'
              }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        Based on {reviewCount}+ reviews
      </span>
      <div className="mt-1 text-foreground/80">
        {isTripAdvisor ? <TripAdvisorLogo /> : <GoogleLogo />}
      </div>
    </div>
  );
};

// Testimonial card component
const TestimonialCard = ({
  review,
  platform
}: {
  review: Review;
  platform: 'tripadvisor' | 'google';
}) => {
  const [expanded, setExpanded] = useState(false);
  const isTripAdvisor = platform === 'tripadvisor';
  const maxLength = 150;
  const shouldTruncate = (review.content?.length || 0) > maxLength;

  const displayContent = expanded || !shouldTruncate
    ? review.content
    : `${review.content?.slice(0, maxLength)}...`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div
      className="flex-shrink-0 w-[320px] sm:w-[360px] p-6 rounded-2xl bg-card border border-border/50 shadow-card hover-lift group"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${isTripAdvisor
              ? 'bg-[#00AF87]/10 text-[#00AF87]'
              : 'bg-[#4285F4]/10 text-[#4285F4]'
            }`}>
            {review.reviewer_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-foreground">{review.reviewer_name}</p>
            <p className="text-xs text-muted-foreground">
              {review.reviewer_country && `${review.reviewer_country} • `}
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        {/* Platform icon */}
        <div className="opacity-60">
          {isTripAdvisor ? (
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#00AF87]">
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <circle cx="12" cy="10" r="4" fill="white" />
              <path d="M9 14 L12 19 L15 14" fill="white" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <text x="4" y="18" fontSize="14" fontWeight="bold">
                <tspan fill="#4285F4">G</tspan>
              </text>
            </svg>
          )}
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating
                ? isTripAdvisor
                  ? 'text-[#00AF87] fill-[#00AF87]'
                  : 'text-[#FBBC05] fill-[#FBBC05]'
                : 'text-muted-foreground/30'
              }`}
          />
        ))}
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-serif font-semibold text-foreground mb-2 line-clamp-1">
          "{review.title}"
        </h4>
      )}

      {/* Content */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {displayContent}
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-primary hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

// Marquee carousel component
const MarqueeCarousel = ({
  reviews,
  platform,
  direction = 'left'
}: {
  reviews: Review[];
  platform: 'tripadvisor' | 'google';
  direction?: 'left' | 'right';
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Double the reviews for seamless loop
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div
      className="relative overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className={`flex gap-6 ${isPaused ? '' : direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{
          width: 'max-content',
        }}
      >
        {duplicatedReviews.map((review, index) => (
          <TestimonialCard
            key={`${review.id}-${index}`}
            review={review}
            platform={platform}
          />
        ))}
      </div>
    </div>
  );
};

// Loading skeleton
const TestimonialSkeleton = () => (
  <div className="flex gap-6 overflow-hidden py-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex-shrink-0 w-[360px] p-6 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-4 w-20 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </div>
);

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeaturedReviews();
  }, []);

  // Intersection observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchFeaturedReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_featured', true)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;

      if (data && data.length >= 4) {
        setReviews(data as Review[]);
      } else {
        // Use demo testimonials if not enough real ones
        setReviews(demoTestimonials);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews(demoTestimonials);
    } finally {
      setIsLoading(false);
    }
  };

  const tripAdvisorReviews = reviews.filter(r => (r.platform || 'tripadvisor') === 'tripadvisor');
  const googleReviews = reviews.filter(r => r.platform === 'google');

  // Ensure we have reviews for both platforms
  const displayTripAdvisorReviews = tripAdvisorReviews.length > 0
    ? tripAdvisorReviews
    : demoTestimonials.filter(r => r.platform === 'tripadvisor');
  const displayGoogleReviews = googleReviews.length > 0
    ? googleReviews
    : demoTestimonials.filter(r => r.platform === 'google');

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Subtle wave background pattern */}
      <div className="absolute inset-0 bg-muted/30">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="wave-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M0 10 Q5 5 10 10 T20 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-ocean"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div
        className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        {/* Header */}
        <div className="container mx-auto px-4 text-center mb-12">
          <span className="inline-block text-sunset font-medium tracking-widest uppercase text-sm mb-4">
            Client Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Words of Delight from Our Valued Travelers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real stories from real travelers who discovered the magic of Sri Lanka with our expert guidance and personalized care.
          </p>
        </div>

        {/* Platform trust blocks */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <PlatformTrustBlock platform="tripadvisor" reviewCount={150} />
            <PlatformTrustBlock platform="google" reviewCount={200} />
          </div>
        </div>

        {/* Carousels */}
        <div className="space-y-8">
          {/* TripAdvisor Carousel */}
          <div>
            <div className="container mx-auto px-4 mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#00AF87]">
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                  <circle cx="12" cy="10" r="4" fill="white" />
                  <path d="M9 14 L12 19 L15 14" fill="white" />
                </svg>
                <span>TripAdvisor Reviews</span>
              </div>
            </div>
            {isLoading ? (
              <div className="container mx-auto px-4">
                <TestimonialSkeleton />
              </div>
            ) : (
              <MarqueeCarousel
                reviews={displayTripAdvisorReviews}
                platform="tripadvisor"
                direction="left"
              />
            )}
          </div>

          {/* Google Carousel */}
          <div>
            <div className="container mx-auto px-4 mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <text x="4" y="18" fontSize="14" fontWeight="bold">
                    <tspan fill="#4285F4">G</tspan>
                  </text>
                </svg>
                <span>Google Reviews</span>
              </div>
            </div>
            {isLoading ? (
              <div className="container mx-auto px-4">
                <TestimonialSkeleton />
              </div>
            ) : (
              <MarqueeCarousel
                reviews={displayGoogleReviews}
                platform="google"
                direction="right"
              />
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 mt-16 text-center">
          <div className="max-w-xl mx-auto">
            <Quote className="w-10 h-10 text-sunset/30 mx-auto mb-4" />
            <p className="font-serif text-xl md:text-2xl text-foreground mb-6">
              Ready to create your own unforgettable journey?
            </p>
            <Button asChild size="lg" className="shadow-card">
              <Link href="/quote">
                Start Planning Your Trip
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* CSS for marquee animation */}
      <style>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-left,
          .animate-marquee-right {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
