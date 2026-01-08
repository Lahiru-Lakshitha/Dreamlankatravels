"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Award, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { QuickQuotePreview } from '@/components/home/QuickQuotePreview';
import { StatsSection } from '@/components/home/StatsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { FAQSection } from '@/components/home/FAQSection';
import { GlassCard } from '@/components/ui/glass-card';

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

  const tours = [
    {
      title: t.home.culturalTriangle,
      duration: t.home.sevenDays,
      price: t.home.fromPrice.replace('{price}', '$899'),
      highlights: ['Sigiriya', 'Kandy', 'Dambulla', 'Polonnaruwa'],
      image: templeImage,
      tag: "Best Seller"
    },
    {
      title: t.home.beachParadise,
      duration: t.home.fiveDays,
      price: t.home.fromPrice.replace('{price}', '$699'),
      highlights: ['Mirissa', 'Unawatuna', t.home.whaleWatching, 'Galle Fort'],
      image: beachImage,
      tag: "Popular"
    },
    {
      title: t.home.wildlifeAdventure,
      duration: t.home.sixDays,
      price: t.home.fromPrice.replace('{price}', '$799'),
      highlights: [t.home.yalaSafari, 'Minneriya', 'Udawalawe', 'Pinnawala'],
      image: wildlifeImage,
      tag: "Adventure"
    },
  ];

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

      {/* Featured Tours Section - Glass Cards */}
      <section className="py-16 bg-muted/30 dark:bg-background relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <span className="text-sunset font-medium tracking-widest uppercase text-sm mb-2 block">
                {t.home.curatedExperiences}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-ocean-dark dark:text-white">
                {t.home.popularTourPackages}
              </h2>
              <p className="text-muted-foreground dark:text-white/80 mt-4 text-lg">
                {t.home.toursSubtitle}
              </p>
            </div>
            <Link href="/tours">
              <Button variant="ocean" size="lg" className="group rounded-full pl-8 pr-6">
                {t.home.viewAllTours}
                <div className="bg-white/20 rounded-full p-1 ml-3 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.map((tour, index) => (
              <div
                key={tour.title}
                className="group relative flex flex-col h-full bg-white dark:bg-white/5 rounded-[2rem] shadow-lg dark:shadow-glow hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-black/5 dark:border-white/10 overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative h-[280px] w-full overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

                  {/* Glass Badges */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {tour.duration}
                  </div>

                  {tour.tag && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-sunset/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/20">
                      {tour.tag}
                    </div>
                  )}

                  {/* Rating Badge (New) */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                    <Star className="w-3 h-3 text-sunglow fill-sunglow" />
                    <span className="text-white text-xs font-bold">5.0</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-grow relative">
                  <div className="mb-4">
                    <h3 className="text-2xl font-serif font-bold text-ocean-dark dark:text-white mb-2 group-hover:text-ocean dark:group-hover:text-sunset transition-colors">
                      {tour.title}
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-sunset to-transparent rounded-full opacity-60 group-hover:w-20 transition-all duration-500" />
                  </div>

                  <div className="space-y-3 mb-8 flex-grow">
                    {tour.highlights.slice(0, 3).map((highlight) => (
                      <div key={highlight} className="flex items-start text-muted-foreground dark:text-white/70 text-sm group/item">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3 shrink-0 mt-0.5 group-hover/item:text-emerald-400 dark:group-hover/item:text-emerald-400 transition-colors" />
                        <span className="group-hover/item:text-foreground dark:group-hover/item:text-white transition-colors">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-border dark:via-white/10 to-transparent mb-6 opacity-50" />

                  {/* Bottom Action */}
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <span className="block text-[10px] text-muted-foreground dark:text-white/60 uppercase tracking-widest font-semibold mb-1">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-ocean-dark dark:text-white group-hover:text-ocean dark:group-hover:text-sunset transition-colors">{tour.price}</span>
                        <span className="text-xs text-muted-foreground dark:text-white/60 font-medium">/ person</span>
                      </div>
                    </div>
                    <Link href="/quote">
                      <Button className="rounded-full h-10 px-5 bg-ocean/10 dark:bg-white/10 text-ocean dark:text-white hover:text-white hover:bg-gradient-to-r hover:from-ocean hover:to-ocean-dark dark:hover:from-sunset dark:hover:to-sunset-dark border border-ocean/20 dark:border-white/10 transition-all duration-300 shadow-sm hover:shadow-glow group/btn">
                        <span className="text-sm font-semibold">{t.home.getQuote}</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
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