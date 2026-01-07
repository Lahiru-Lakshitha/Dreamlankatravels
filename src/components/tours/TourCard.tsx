"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TourCardProps {
  tour: {
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
  };
}

export function TourCard({ tour }: TourCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800';

  return (
    <div className="bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-card hover-lift group">
      <Link href={`/tours/${tour.slug}`}>
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <Image
            src={tour.image_url || defaultImage}
            alt={tour.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {tour.featured && (
            <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-sunset text-ocean-dark">
              Featured
            </Badge>
          )}
          {tour.rating && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 sm:px-3 py-1 bg-card/90 backdrop-blur-sm text-card-foreground text-sm font-semibold rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 text-sunset fill-sunset" />
              {tour.rating.toFixed(1)}
              {tour.review_count && (
                <span className="text-muted-foreground text-xs">
                  ({tour.review_count})
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/tours/${tour.slug}`}>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-card-foreground hover:text-sunset transition-colors">
              {tour.name}
            </h3>
          </Link>
          {tour.tour_type && (
            <Badge variant="outline" className="shrink-0 text-xs capitalize">
              {tour.tour_type}
            </Badge>
          )}
        </div>

        {tour.short_description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {tour.short_description}
          </p>
        )}

        <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 text-xs sm:text-sm text-muted-foreground">
          {tour.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="truncate">{tour.duration}</span>
            </div>
          )}
          {tour.group_size_max && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="truncate">Up to {tour.group_size_max}</span>
            </div>
          )}
          {tour.destinations && tour.destinations.length > 0 && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {tour.destinations.length} destination{tour.destinations.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {tour.highlights && tour.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tour.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full"
              >
                {highlight}
              </span>
            ))}
            {tour.highlights.length > 3 && (
              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                +{tour.highlights.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-muted-foreground text-xs sm:text-sm">From</span>
            <p className="font-serif text-xl sm:text-2xl font-bold text-sunset">
              ${tour.price?.toLocaleString() || 'TBD'}
            </p>
          </div>
          <Link href={`/tours/${tour.slug}`}>
            <Button variant="ocean" size="sm" className="group/btn">
              View Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
