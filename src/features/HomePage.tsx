"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { QuickQuotePreview } from '@/components/home/QuickQuotePreview';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { FAQSection } from '@/components/home/FAQSection';
import { TourCard } from '@/components/tours/TourCard';
import { useTours } from '@/hooks/useTours';

// Images
import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { t } = useLanguage();

  const destinations = [
    {
      title: t.home.pristineBeaches,
      description: t.home.goldenSands,
      image: beachImage,
      link: '/tours?type=beach',
      delay: "100"
    },
    {
      title: t.home.ancientTemples,
      description: t.home.sacredHeritage,
      image: templeImage,
      link: '/tours?type=cultural',
      delay: "200"
    },
    {
      title: t.home.wildlifeSafari,
      description: t.home.majesticElephants,
      image: wildlifeImage,
      link: '/tours?type=wildlife',
      delay: "300"
    },
    {
      title: t.home.scenicRailways,
      description: t.home.mountainJourneys,
      image: trainImage,
      link: '/tours?destination=ella',
      delay: "400"
    },
  ];

  const { tours } = useTours();

  const whyChooseUs = [
    { title: t.home.localExpertGuides, desc: t.home.localExpertGuidesDesc },
    { title: t.home.personalizedItineraries, desc: t.home.personalizedItinerariesDesc },
    { title: t.home.support247, desc: t.home.support247Desc },
    { title: t.home.bestPriceGuarantee, desc: t.home.bestPriceGuaranteeDesc },
  ];

  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Quick Quote Floating Section */}
      <div className="-mt-20 relative z-20 container mx-auto px-4 mb-20">
        <QuickQuotePreview />
      </div>

      {/* Destinations Section - Premium Grid */}
      <section className="py-12 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <span className="text-sunset font-serif italic text-lg tracking-wider">
              {t.home.exploreSriLanka}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-ocean-dark dark:text-white mt-2 mb-4">
              {t.home.unforgettableDestinations}
            </h2>
            <p className="text-muted-foreground dark:text-white/80 text-lg leading-relaxed">
              {t.home.destinationsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <Link
                key={dest.title}
                href={dest.link}
                className="group block"
              >
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl shadow-soft transition-all duration-700 hover:shadow-strong group-hover:-translate-y-2">
                  <Image
                    src={dest.image}
                    alt={dest.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/90 via-ocean-dark/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                  {/* Content - Slide Up on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      {dest.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {dest.description}
                    </p>
                    <div className="flex items-center text-sunset text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      Explore Now <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/destinations">
              <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-ocean hover:text-white transition-colors border-2">
                {t.home.viewAllDestinations}
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
            {tours.slice(0, 3).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Split Layout */}
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
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-sunset fill-sunset" />
                  ))}
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

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}