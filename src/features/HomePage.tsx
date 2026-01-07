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
import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';

export default function HomePage() {
  const { t } = useLanguage();

  const destinations = [
    {
      title: t.home.pristineBeaches,
      description: t.home.goldenSands,
      image: beachImage,
      link: '/tours?type=beach',
    },
    {
      title: t.home.ancientTemples,
      description: t.home.sacredHeritage,
      image: templeImage,
      link: '/tours?type=cultural',
    },
    {
      title: t.home.wildlifeSafari,
      description: t.home.majesticElephants,
      image: wildlifeImage,
      link: '/tours?type=wildlife',
    },
    {
      title: t.home.scenicRailways,
      description: t.home.mountainJourneys,
      image: trainImage,
      link: '/tours?destination=ella',
    },
  ];

  const tours = [
    {
      title: t.home.culturalTriangle,
      duration: t.home.sevenDays,
      price: t.home.fromPrice.replace('{price}', '$899'),
      highlights: ['Sigiriya', 'Kandy', 'Dambulla', 'Polonnaruwa'],
      image: templeImage,
    },
    {
      title: t.home.beachParadise,
      duration: t.home.fiveDays,
      price: t.home.fromPrice.replace('{price}', '$699'),
      highlights: ['Mirissa', 'Unawatuna', t.home.whaleWatching, 'Galle Fort'],
      image: beachImage,
    },
    {
      title: t.home.wildlifeAdventure,
      duration: t.home.sixDays,
      price: t.home.fromPrice.replace('{price}', '$799'),
      highlights: [t.home.yalaSafari, 'Minneriya', 'Udawalawe', 'Pinnawala'],
      image: wildlifeImage,
    },
  ];

  const whyChooseUs = [
    { title: t.home.localExpertGuides, desc: t.home.localExpertGuidesDesc },
    { title: t.home.personalizedItineraries, desc: t.home.personalizedItinerariesDesc },
    { title: t.home.support247, desc: t.home.support247Desc },
    { title: t.home.bestPriceGuarantee, desc: t.home.bestPriceGuaranteeDesc },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Quick Quote Preview - Replaces old section after hero */}
      <QuickQuotePreview />

      {/* Destinations Section */}
      <section className="py-12 sm:py-14 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary font-medium tracking-wide uppercase text-sm">
              {t.home.exploreSriLanka}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
              {t.home.unforgettableDestinations}
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              {t.home.destinationsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {destinations.map((dest, index) => (
              <Link
                key={dest.title}
                href={dest.link}
                className="group relative h-72 rounded-xl overflow-hidden hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Image
                  src={dest.image}
                  alt={dest.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-sand mb-1">
                    {dest.title}
                  </h3>
                  <p className="text-sand/80 text-sm">
                    {dest.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/destinations">
              <Button variant="ocean" size="lg" className="group">
                {t.home.viewAllDestinations}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-12 sm:py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary font-medium tracking-wide uppercase text-sm">
              {t.home.curatedExperiences}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
              {t.home.popularTourPackages}
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">
              {t.home.toursSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tours.map((tour, index) => (
              <div
                key={tour.title}
                className="bg-card rounded-xl overflow-hidden shadow-card hover-lift group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-sunset text-ocean-dark text-sm font-semibold rounded-full">
                    {tour.duration}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {tour.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tour.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {tour.price}
                    </span>
                    <Link href="/quote">
                      <Button variant="oceanOutline" size="sm">
                        {t.home.getQuote}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/tours">
              <Button variant="gold" size="lg" className="group">
                {t.home.viewAllTours}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-14 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sunset font-medium tracking-wide uppercase text-sm">
                {t.home.whyVoyagesLanka}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-sand mt-2 mb-5">
                {t.home.yourJourneyOurExpertise}
              </h2>
              <p className="text-sand/80 text-base mb-6 leading-relaxed">
                {t.home.whyChooseUsDesc}
              </p>

              <div className="space-y-5">
                {whyChooseUs.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-sunset/20 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-sunset" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sand">{item.title}</h4>
                      <p className="text-sand/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/about">
                  <Button variant="heroOutline" size="lg" className="group">
                    {t.home.learnMoreAboutUs}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-elevated">
                <Image
                  src={trainImage}
                  alt="Scenic train journey in Sri Lanka"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Floating Review Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-5 rounded-xl shadow-elevated max-w-xs">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-sunset fill-sunset" />
                  ))}
                </div>
                <p className="text-card-foreground font-medium text-sm mb-1">
                  "{t.home.testimonialQuote}"
                </p>
                <p className="text-muted-foreground text-xs">
                  — {t.home.testimonialAuthor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Stats Section - Moved after testimonials */}
      <StatsSection />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <section className="py-12 sm:py-14 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary))_0%,transparent_70%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
              {t.home.readyToExplore}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t.home.ctaSubtitle}
            </p>
            <Link href="/quote">
              <Button variant="hero" size="xl" className="group">
                {t.home.requestFreeQuote}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}