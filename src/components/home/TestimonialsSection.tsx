import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const demoTestimonials: Review[] = [
    {
        id: 'demo-1',
        reviewer_name: 'Sarah Mitchell',
        reviewer_country: 'United Kingdom',
        rating: 5,
        title: 'Absolutely magical experience!',
        content: 'From the moment we landed, Dream Lanka Travels took care of everything. The attention to detail, local insights, and genuine care for our experience made this the best trip we\'ve ever taken. Highly recommended to anyone visiting Sri Lanka!',
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
        content: 'The cultural tour was incredible. Our guide knew every hidden gem and local story. The accommodations were perfect and the itinerary was balanced beautifully. We felt completely safe and welcomed throughout the journey.',
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
        content: 'We chose Dream Lanka for our honeymoon and it was the best decision. Every romantic dinner, private tour, and special moment was perfectly arranged. The beach resorts were stunning and the wildlife safari was a highlight.',
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
        content: 'The team understood exactly what we wanted. From wildlife safaris to beach relaxation, every day was perfectly planned. The driver was professional, punctual, and very friendly. Will definitely come back!',
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
        content: 'The logistics were flawless. Punctual pickups, excellent hotels, and knowledgeable guides. Sri Lanka exceeded all my expectations thanks to this team. The tea plantation visit was particularly memorable.',
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
        content: 'We\'ve traveled extensively but this trip stands out. The authenticity, the food, the people - everything was curated with such care and expertise. Thank you Dream Lanka for showing us the real Sri Lanka.',
        travel_date: '2024-06-15',
        platform: 'google',
        created_at: '2024-06-20',
    },
    {
        id: 'demo-7',
        reviewer_name: 'Elena Rossi',
        reviewer_country: 'Italy',
        rating: 5,
        title: 'Un viaggio indimenticabile',
        content: 'Tutto perfetto. Dagli hotel di lusso alle guide esperte. Un grazie speciale al nostro autista che ci ha fatto sentire a casa. Consiglio vivamente questa agenzia a tutti gli italiani che vogliono visitare lo Sri Lanka.',
        travel_date: '2024-05-10',
        platform: 'tripadvisor',
        created_at: '2024-05-15',
    },
    {
        id: 'demo-8',
        reviewer_name: 'David Smith',
        reviewer_country: 'Canada',
        rating: 5,
        title: 'Five star service all the way',
        content: 'I was worried about traveling solo, but Dream Lanka made it seamless. I felt safe, cared for, and saw so much more than I could have on my own. The itinerary was flexible enough to allow for spontaneous stops.',
        travel_date: '2024-04-05',
        platform: 'google',
        created_at: '2024-04-10',
    },
];

// --- Sub-Components ---

const PlatformLogo = ({ platform }: { platform: 'tripadvisor' | 'google' }) => {
    if (platform === 'tripadvisor') {
        return (
            <div className="flex items-center gap-2">
                <svg viewBox="0 0 100 20" className="h-4 w-auto">
                    <circle cx="10" cy="10" r="8" fill="#00AA6C" />
                    <circle cx="10" cy="8" r="3" fill="white" />
                    <path d="M7 12 L10 16 L13 12" fill="white" />
                    <text x="22" y="15" fill="currentColor" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Tripadvisor</text>
                </svg>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2">
            <svg viewBox="0 0 70 24" className="h-4 w-auto">
                <text x="0" y="18" fontSize="16" fontWeight="500" fontFamily="sans-serif">
                    <tspan fill="#4285F4">G</tspan>
                    <tspan fill="#EA4335">o</tspan>
                    <tspan fill="#FBBC05">o</tspan>
                    <tspan fill="#4285F4">g</tspan>
                    <tspan fill="#34A853">l</tspan>
                    <tspan fill="#EA4335">e</tspan>
                </text>
            </svg>
        </div>
    );
};

const HeaderBlock = ({ platform, count }: { platform: 'tripadvisor' | 'google'; count: number }) => {
    const isTripAdvisor = platform === 'tripadvisor';
    const colorClass = isTripAdvisor ? 'text-[#00AA6C]' : 'text-[#FBBC05]';

    return (
        <div className="flex flex-col items-center justify-center text-center mb-4 px-4 sticky left-0 right-0 z-10 w-full bg-[#E5F2EB]/95 dark:bg-[#03140e]/95 backdrop-blur-sm py-2">
            <h3 className="text-base md:text-lg font-bold tracking-wide uppercase mb-1 text-gray-800 dark:text-gray-100">EXCELLENT</h3>
            <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-5 h-5 fill-current ${colorClass}`} />
                ))}
            </div>
            <p className="text-[10px] text-muted-foreground dark:text-gray-400 mb-1 uppercase tracking-wider">
                Based on <span className="font-bold text-gray-900 dark:text-gray-200">{count} reviews</span>
            </p>
            <div className="opacity-90 grayscale hover:grayscale-0 transition-all duration-300 transform scale-90 dark:grayscale-0">
                <PlatformLogo platform={platform} />
            </div>
        </div>
    );
};

const ReviewCard = ({ review }: { review: Review }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isTripAdvisor = review.platform === 'tripadvisor';
    const initial = review.reviewer_name.charAt(0).toUpperCase();

    return (
        <div
            className={`
                flex-shrink-0 w-[260px] md:w-[300px]
                bg-white dark:bg-[#131f1c]
                dark:border dark:border-white/5
                rounded-2xl 
                p-5
                shadow-sm dark:shadow-none
                transition-all duration-500 ease-in-out
                relative
                flex flex-col
                ${isExpanded ? 'h-auto z-10 scale-[1.02] shadow-md dark:bg-[#1a2c28]' : 'h-auto'}
            `}
        >
            {/* Platform Badge overlay */}
            <div className="absolute top-4 right-4 opacity-40">
                {isTripAdvisor ? (
                    <div className="w-3 h-3 rounded-full bg-[#00AA6C] flex items-center justify-center">
                        <i className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                ) : (
                    <div className="w-3 h-3 font-bold text-[#4285F4] text-[10px]">G</div>
                )}
            </div>

            {/* Header: Avatar + Info */}
            <div className="flex items-center gap-3 mb-2">
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    text-white font-bold text-xs shadow-sm flex-shrink-0
                    ${isTripAdvisor ? 'bg-[#00AA6C]' : 'bg-[#4285F4]'}
                `}>
                    {initial}
                </div>
                <div className="overflow-hidden min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 leading-tight truncate">
                        {review.reviewer_name}
                    </h4>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate uppercase tracking-wide">
                        {review.reviewer_country || 'Traveler'}
                    </p>
                </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        className={`w-2.5 h-2.5 fill-current ${s <= review.rating ? (isTripAdvisor ? 'text-[#00AA6C]' : 'text-[#FBBC05]') : 'text-gray-300 dark:text-gray-600'}`}
                    />
                ))}
            </div>

            {/* Title */}
            {review.title && (
                <h5 className="font-semibold text-xs mb-1 line-clamp-1 text-gray-800 dark:text-gray-200">{review.title}</h5>
            )}

            {/* Content */}
            <div className="flex-grow">
                <p className={`text-xs text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'}`}>
                    {review.content}
                </p>
            </div>

            {/* Read More */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                }}
                className="text-[10px] font-bold uppercase tracking-wider text-[#00AA6C] dark:text-[#00AA6C] hover:text-[#008f5d] transition-colors mt-2 text-left"
            >
                {isExpanded ? 'Show less' : 'Read more'}
            </button>
        </div>
    );
}

const ReviewBlock = ({ platform, reviews, direction = 'left' }: { platform: 'tripadvisor' | 'google', reviews: Review[], direction?: 'left' | 'right' }) => {
    // Duplicate list for seamless loop
    const duplicatedReviews = [...reviews, ...reviews];

    return (
        <div className="relative mb-8 last:mb-0">
            <HeaderBlock platform={platform} count={reviews.length + 140} />

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden select-none group">

                {/* Visual Arrows (Decorative) */}
                <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="
                        w-10 h-10 rounded-full shadow-lg border-2 border-white dark:border-white/10
                        flex items-center justify-center 
                        bg-[#00AA6C] text-white opacity-90
                    ">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                </div>

                <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="
                        w-10 h-10 rounded-full shadow-lg border-2 border-white dark:border-white/10
                        flex items-center justify-center 
                        bg-[#00AA6C] text-white opacity-90
                    ">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>

                {/* Marquee Track */}
                <div
                    className={`
                        flex w-max gap-4 items-start py-4 group-hover:[animation-play-state:paused]
                        ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}
                    `}
                >
                    {duplicatedReviews.map((review, i) => (
                        <ReviewCard key={`${platform}-${review.id}-${i}`} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
};


export function TestimonialsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('is_featured', true)
                    .eq('is_approved', true)
                    .order('created_at', { ascending: false });

                if (data && data.length > 0) {
                    setReviews(data as Review[]);
                } else {
                    setReviews(demoTestimonials);
                }
            } catch (e) {
                console.error(e);
                setReviews(demoTestimonials);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const tripAdvisorReviews = reviews.filter(r => (r.platform || 'tripadvisor') === 'tripadvisor');
    const googleReviews = reviews.filter(r => r.platform === 'google');

    // Ensure we have minimal list (e.g. 5 items) before duplication to ensure track is wider than screen
    // If list is small (e.g. 2 items), duplication x 2 is 4 items. On 1080p, 4x300px = 1200px. Might be tight.
    // Let's duplicate more if list is small.
    const ensureMinLength = (list: Review[]) => {
        let result = list;
        while (result.length < 5) {
            result = [...result, ...result];
        }
        return result;
    };

    const displayTripAdvisor = tripAdvisorReviews.length > 0 ? tripAdvisorReviews : demoTestimonials.filter(r => r.platform === 'tripadvisor');
    const displayGoogle = googleReviews.length > 0 ? googleReviews : demoTestimonials.filter(r => r.platform === 'google');

    const finalTripAdvisor = ensureMinLength(displayTripAdvisor);
    const finalGoogle = ensureMinLength(displayGoogle);


    return (
        <section className="relative py-10 bg-[#E5F2EB] dark:bg-[#03140e] overflow-hidden transition-colors duration-500">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.03]">
                <svg width="100%" height="100%">
                    <pattern id="contour" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M0 50 Q 25 25 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="2" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#contour)" />
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10 p-0 max-w-5xl lg:max-w-[980px]">
                <div className="space-y-4 md:space-y-4">
                    <ReviewBlock platform="tripadvisor" reviews={finalTripAdvisor} direction="left" />
                    <ReviewBlock platform="google" reviews={finalGoogle} direction="right" />
                </div>

                <div className="text-center mt-6">
                    <Button asChild size="sm" className="rounded-full px-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-[#00AA6C]">
                        <Link href="/quote">Start Your Journey</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
