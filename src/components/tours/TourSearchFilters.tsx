"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

export interface TourFilters {
  search: string;
  destination: string;
  tourType: string;
  minPrice: number;
  maxPrice: number;
  duration: string;
  sortBy: string;
}

interface TourSearchFiltersProps {
  onFiltersChange: (filters: TourFilters) => void;
  destinations: string[];
  tourTypes: string[];
}

const TOUR_TYPES = [
  { value: 'cultural', label: 'Cultural & Heritage' },
  { value: 'wildlife', label: 'Wildlife Safari' },
  { value: 'beach', label: 'Beach Holiday' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'honeymoon', label: 'Honeymoon' },
  { value: 'wellness', label: 'Wellness & Ayurveda' },
];

const DURATIONS = [
  { value: 'any', label: 'Any Duration' },
  { value: '1-3', label: '1-3 Days' },
  { value: '4-7', label: '4-7 Days' },
  { value: '8-14', label: '8-14 Days' },
  { value: '15+', label: '15+ Days' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'duration-short', label: 'Duration: Shortest' },
  { value: 'duration-long', label: 'Duration: Longest' },
  { value: 'rating', label: 'Highest Rated' },
];

export function TourSearchFilters({
  onFiltersChange,
  destinations,
  tourTypes
}: TourSearchFiltersProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [filters, setFilters] = useState<TourFilters>({
    search: searchParams.get('search') || '',
    destination: searchParams.get('destination') || '',
    tourType: searchParams.get('type') || '',
    minPrice: parseInt(searchParams.get('minPrice') || '0'),
    maxPrice: parseInt(searchParams.get('maxPrice') || '5000'),
    duration: searchParams.get('duration') || '',
    sortBy: searchParams.get('sort') || 'featured',
  });

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.destination) params.set('destination', filters.destination);
    if (filters.tourType) params.set('type', filters.tourType);
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice < 5000) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.duration) params.set('duration', filters.duration);
    if (filters.sortBy !== 'featured') params.set('sort', filters.sortBy);

    router.replace(`${pathname}?${params.toString()}`);
    onFiltersChange(filters);
  }, [filters, router, pathname, onFiltersChange]);

  const updateFilter = <K extends keyof TourFilters>(key: K, value: TourFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      destination: '',
      tourType: '',
      minPrice: 0,
      maxPrice: 5000,
      duration: '',
      sortBy: 'featured',
    });
  };

  const activeFilterCount = [
    filters.destination,
    filters.tourType,
    filters.duration,
    filters.minPrice > 0 || filters.maxPrice < 5000,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Destination */}
      <div className="space-y-2">
        <Label>Destination</Label>
        <Select
          value={filters.destination || "all"}
          onValueChange={(v) => updateFilter('destination', v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Destinations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Destinations</SelectItem>
            {destinations.map(dest => (
              <SelectItem key={dest} value={dest}>{dest}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tour Type */}
      <div className="space-y-2">
        <Label>Tour Type</Label>
        <Select
          value={filters.tourType || "all"}
          onValueChange={(v) => updateFilter('tourType', v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TOUR_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label>Duration</Label>
        <Select
          value={filters.duration || "any"}
          onValueChange={(v) => updateFilter('duration', v === "any" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any Duration" />
          </SelectTrigger>
          <SelectContent>
            {DURATIONS.map(dur => (
              <SelectItem key={dur.value} value={dur.value}>{dur.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label>Price Range (USD)</Label>
        <div className="px-2">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            min={0}
            max={5000}
            step={100}
            onValueChange={([min, max]) => {
              setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
            }}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${filters.minPrice}</span>
          <span>${filters.maxPrice}</span>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="w-4 h-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar & Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tours..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(v) => updateFilter('sortBy', v)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile Filter Button */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden relative">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Filter Tours</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 gap-4">
          {/* Destination */}
          <Select
            value={filters.destination || "all"}
            onValueChange={(v) => updateFilter('destination', v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Destinations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              {destinations.map(dest => (
                <SelectItem key={dest} value={dest}>{dest}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tour Type */}
          <Select
            value={filters.tourType || "all"}
            onValueChange={(v) => updateFilter('tourType', v === "all" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {TOUR_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Duration */}
          <Select
            value={filters.duration || "any"}
            onValueChange={(v) => updateFilter('duration', v === "any" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map(dur => (
                <SelectItem key={dur.value} value={dur.value}>{dur.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Price Range Quick Select */}
          <Select
            value={`${filters.minPrice}-${filters.maxPrice}`}
            onValueChange={(v) => {
              const [min, max] = v.split('-').map(Number);
              setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-5000">Any Budget</SelectItem>
              <SelectItem value="0-500">Under $500</SelectItem>
              <SelectItem value="500-1000">$500 - $1,000</SelectItem>
              <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
              <SelectItem value="2000-5000">$2,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.destination && (
            <Badge variant="secondary" className="gap-1">
              {filters.destination}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter('destination', '')}
              />
            </Badge>
          )}
          {filters.tourType && (
            <Badge variant="secondary" className="gap-1">
              {TOUR_TYPES.find(t => t.value === filters.tourType)?.label}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter('tourType', '')}
              />
            </Badge>
          )}
          {filters.duration && (
            <Badge variant="secondary" className="gap-1">
              {DURATIONS.find(d => d.value === filters.duration)?.label}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => updateFilter('duration', '')}
              />
            </Badge>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 5000) && (
            <Badge variant="secondary" className="gap-1">
              ${filters.minPrice} - ${filters.maxPrice}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => {
                  setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 5000 }));
                }}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
