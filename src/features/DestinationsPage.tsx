"use client";

import Image from 'next/image';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageHeroStrip } from '@/components/layout/PageHeroStrip';
import beachImage from '@/assets/destination-beach.jpg';
import templeImage from '@/assets/destination-temple.jpg';
import wildlifeImage from '@/assets/destination-wildlife.jpg';
import trainImage from '@/assets/destination-train.jpg';
import heroImage from '@/assets/hero-sigiriya.jpg';

const destinations = [
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    region: 'Cultural Triangle',
    image: heroImage,
    description: 'The iconic Lion Rock fortress rising 200m above the jungle, featuring ancient frescoes and stunning panoramic views.',
    highlights: ['UNESCO World Heritage', 'Ancient Fortress', 'Frescoes', 'Royal Gardens'],
  },
  {
    id: 'kandy',
    name: 'Kandy',
    region: 'Hill Country',
    image: templeImage,
    description: 'Sri Lanka\'s cultural capital, home to the sacred Temple of the Tooth and surrounded by misty hills.',
    highlights: ['Temple of the Tooth', 'Botanical Gardens', 'Kandyan Dancing', 'Lake Views'],
  },
  {
    id: 'ella',
    name: 'Ella',
    region: 'Hill Country',
    image: trainImage,
    description: 'A charming mountain village famous for its scenic train journeys and breathtaking hiking trails.',
    highlights: ['Nine Arch Bridge', 'Ella Rock', 'Tea Plantations', 'Little Adam\'s Peak'],
  },
  {
    id: 'yala',
    name: 'Yala National Park',
    region: 'Southern Province',
    image: wildlifeImage,
    description: 'Home to the highest density of leopards in the world, along with elephants, bears, and diverse birdlife.',
    highlights: ['Leopard Safari', 'Elephants', 'Bird Watching', 'Coastal Scenery'],
  },
  {
    id: 'mirissa',
    name: 'Mirissa',
    region: 'Southern Coast',
    image: beachImage,
    description: 'A tropical paradise known for its crescent-shaped beach and being one of the best whale watching spots in the world.',
    highlights: ['Whale Watching', 'Beach Paradise', 'Surfing', 'Nightlife'],
  },
  {
    id: 'galle',
    name: 'Galle Fort',
    region: 'Southern Coast',
    image: beachImage,
    description: 'A UNESCO-listed Dutch colonial fort with charming streets, boutique shops, and oceanfront cafes.',
    highlights: ['Colonial Architecture', 'Art Galleries', 'Boutique Shopping', 'Sunset Views'],
  },
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen pt-20">
      <MetaTags
        title="Destinations"
        description="Explore Sri Lanka's top destinations - from ancient Sigiriya fortress to tropical Mirissa beaches. Discover UNESCO sites, wildlife parks, and scenic hill country."
      />

      {/* Hero Strip */}
      <PageHeroStrip
        accentLabel="Explore Sri Lanka"
        title="Destinations"
        subtitle="From ancient ruins to tropical beaches, discover the incredible diversity that makes Sri Lanka a must-visit destination."
      />

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {destinations.map((dest, index) => (
              <div
                key={dest.id}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl ${index === 0 ? 'md:col-span-2 h-72 sm:h-96' : 'h-64 sm:h-80'
                  }`}
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/90 via-ocean-dark/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                  <div className="flex items-center gap-2 text-sunset text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    {dest.region}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-sand/80 mb-4 max-w-xl text-sm sm:text-base line-clamp-2 sm:line-clamp-none">
                    {dest.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dest.highlights.slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-sand/20 text-sand rounded-full backdrop-blur-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                    {dest.highlights.length > 3 && (
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-sand/20 text-sand rounded-full backdrop-blur-sm hidden sm:inline">
                        +{dest.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                  {/* Fixed: Link to tours page filtered by destination instead of non-existent detail page */}
                  <Link href={`/tours?destination=${dest.id}`}>
                    <Button variant="heroOutline" size="sm" className="group/btn">
                      Explore Tours
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ocean-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-sand mb-4">
            Ready to Explore?
          </h2>
          <p className="text-sand/80 text-lg mb-8 max-w-2xl mx-auto">
            Let us help you create the perfect itinerary covering all your
            dream destinations in Sri Lanka.
          </p>
          <Link href="/quote">
            <Button variant="hero" size="xl" className="group">
              Plan Your Trip
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
