import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface InstagramImage {
  id: string;
  image_url: string;
  alt_text: string | null;
}

// Fallback images when database is empty
const FALLBACK_IMAGES: InstagramImage[] = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop', alt_text: 'Sri Lanka Mountains' },
  { id: '2', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop', alt_text: 'Tropical Beach' },
  { id: '3', image_url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&h=600&fit=crop', alt_text: 'Travel Adventure' },
  { id: '4', image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=600&fit=crop', alt_text: 'Elephant Safari' },
  { id: '5', image_url: 'https://images.unsplash.com/photo-1588598198600-a8c9e68e5b2e?w=600&h=600&fit=crop', alt_text: 'Temple Architecture' },
  { id: '6', image_url: 'https://images.unsplash.com/photo-1590123718128-6c9fef49b15d?w=600&h=600&fit=crop', alt_text: 'Tea Plantations' },
  { id: '7', image_url: 'https://images.unsplash.com/photo-1586804073166-d9c8d19c4a2f?w=600&h=600&fit=crop', alt_text: 'Sri Lanka Wildlife' },
  { id: '8', image_url: 'https://images.unsplash.com/photo-1518544866330-95a2ab67e72e?w=600&h=600&fit=crop', alt_text: 'Palm Trees Beach' },
];

export function InstagramFeed() {
  const [images, setImages] = useState<InstagramImage[]>([]);
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/voyageslanka');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

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

  const fetchSettings = async () => {
    try {
      const { data: settings } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['instagram_profile_url', 'instagram_feed_enabled']);

      if (settings) {
        settings.forEach(s => {
          if (s.key === 'instagram_profile_url' && s.value) {
            setInstagramUrl(s.value);
          }
          if (s.key === 'instagram_feed_enabled') {
            setIsEnabled(s.value === 'true');
          }
        });
      }

      const { data: imagesData } = await supabase
        .from('instagram_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(8);

      if (imagesData && imagesData.length > 0) {
        setImages(imagesData);
      } else {
        setImages(FALLBACK_IMAGES);
      }
    } catch (error) {
      console.error('Error fetching instagram settings:', error);
      setImages(FALLBACK_IMAGES);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEnabled) return null;

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <span className="text-foreground/80 font-medium">@voyageslanka</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Travel Inspiration
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Discover the beauty of Sri Lanka through our lens and join thousands of adventurers on this journey
          </p>
        </div>

        {/* Premium Image Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl sm:rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
            {images.slice(0, 8).map((image, index) => (
              <a
                key={image.id}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || 'Sri Lanka travel photo'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Premium hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark/90 via-ocean-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-4">
                  <div className="flex items-center gap-4 text-sand mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 500 + 100)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 50 + 5)}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-sand/70 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75" />
                </div>

                {/* Subtle border */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-inset ring-foreground/5 group-hover:ring-sunset/30 transition-all duration-300" />
              </a>
            ))}
          </div>
        )}

        {/* Premium CTA Button */}
        <div className={`text-center mt-10 sm:mt-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:shadow-pink-500/25 transition-all duration-300 hover:-translate-y-1"
          >
            <Instagram className="w-5 h-5 transition-transform group-hover:rotate-12" />
            Follow Our Journey
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
}
