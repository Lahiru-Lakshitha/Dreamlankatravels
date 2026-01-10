"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { t } from '@/data/translations';
import { HeroPlaceholder } from '@/components/home/HeroPlaceholder';
import { Tour } from '@/data/tours';

// Dynamic Imports for performance
const HeroCarousel = dynamic(() => import('@/components/home/HeroCarousel').then(mod => mod.HeroCarousel), {
  ssr: false,
  loading: () => <HeroPlaceholder />
});
const DestinationsGrid = dynamic(() => import('@/components/home/DestinationsGrid').then(mod => mod.DestinationsGrid));
const QuickQuotePreview = dynamic(() => import('@/components/home/QuickQuotePreview').then(mod => mod.QuickQuotePreview));
const StatsSection = dynamic(() => import('@/components/home/StatsSection').then(mod => mod.StatsSection));
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection').then(mod => mod.TestimonialsSection));
const NewsletterSection = dynamic(() => import('@/components/home/NewsletterSection').then(mod => mod.NewsletterSection));
const InstagramFeed = dynamic(() => import('@/components/home/InstagramFeed').then(mod => mod.InstagramFeed));
const FAQSection = dynamic(() => import('@/components/home/FAQSection').then(mod => mod.FAQSection));
const TourCard = dynamic(() => import('@/components/tours/TourCard').then(mod => mod.TourCard));

// Static Images for "Why Choose Us"
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';

interface HomePageProps {
  tours: Tour[];
}

export default function HomePage({ tours }: HomePageProps) {


  const whyChooseUs = [
    { title: t.home.localExpertGuides, desc: t.home.localExpertGuidesDesc },
    { title: t.home.personalizedItineraries, desc: t.home.personalizedItinerariesDesc },
    { title: t.home.support247, desc: t.home.support247Desc },
    { title: t.home.bestPriceGuarantee, desc: t.home.bestPriceGuaranteeDesc },
  ];

  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Carousel - Dynamic with Placeholder */}
      <HeroCarousel />

      {/* Quick Quote Floating Section */}
      <div className="-mt-20 relative z-20 container mx-auto px-4 mb-20">
        <QuickQuotePreview />
      </div>

      {/* Destinations Section - Extracted & Dynamic */}
      <DestinationsGrid />

      {/* Featured Tours Section - Unified with Tours Page */}
      <section className="py-16 sm:py-24 bg-muted/30 dark:bg-background relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <span className="text-sunset font-medium tracking-widest uppercase text-sm mb-2 block">
                {t.home.curatedExperiences}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-ocean-dark dark:text-white">
                Featured Tours in Sri Lanka
              </h2>
              <p className="text-muted-foreground dark:text-white/80 mt-4 text-lg">
                Explore our most popular handcrafted Sri Lanka tour packages.
              </p>
            </div>
            <Link href="/tours">
              <Button variant="ocean" size="lg" className="group rounded-full pl-8 pr-6">
                View All Tours
                <div className="bg-white/20 rounded-full p-1 ml-3 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tours && tours.slice(0, 3).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-ocean-dark relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sunset font-medium tracking-wide uppercase text-sm mb-2 block">
                {t.home.whyVoyagesLanka}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                {t.home.yourJourneyOurExpertise}
              </h2>
              <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-lg">
                {t.home.whyChooseUsDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-6">
                {whyChooseUs.map((item) => (
                  <div key={item.title} className="flex flex-col gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 mb-2">
                      <Award className="w-6 h-6 text-sunset" />
                    </div>
                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <Link href="/about">
                  <Button variant="hero" size="lg" className="px-10">
                    {t.home.learnMoreAboutUs}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative lg:h-[600px] h-[400px]">
              {/* Overlapping Images Effect */}
              <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl z-20">
                <Image
                  src={trainImage}
                  alt="Scenic train journey in Sri Lanka"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl z-10">
                <Image
                  src={wildlifeImage}
                  alt="Sri Lanka Wildlife"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Trust Badge Floating */}
              <div className="absolute bottom-10 right-10 z-30 bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-elevated max-w-xs animate-float">
                <div className="flex gap-1 mb-2">
                  <div className="flex text-sunset">★★★★★</div>
                </div>
                <p className="font-serif italic text-ocean-dark font-medium text-lg mb-2">
                  "{t.home.testimonialQuote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ocean text-white flex items-center justify-center text-xs font-bold">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ocean-dark">{t.home.testimonialAuthor}</p>
                    <p className="text-xs text-muted-foreground">Verified Traveler</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Sections */}
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <InstagramFeed />
      <NewsletterSection />
    </div>
  );
}