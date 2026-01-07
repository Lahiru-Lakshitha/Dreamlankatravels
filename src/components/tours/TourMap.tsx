import { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ContentLoading } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

// Lazy load the map to improve performance
const LazyMapContainer = lazy(() => 
  import('react-leaflet').then(mod => ({ default: mod.MapContainer }))
);
const LazyTileLayer = lazy(() => 
  import('react-leaflet').then(mod => ({ default: mod.TileLayer }))
);
const LazyMarker = lazy(() => 
  import('react-leaflet').then(mod => ({ default: mod.Marker }))
);
const LazyPopup = lazy(() => 
  import('react-leaflet').then(mod => ({ default: mod.Popup }))
);
const LazyPolyline = lazy(() => 
  import('react-leaflet').then(mod => ({ default: mod.Polyline }))
);

interface MapCoordinate {
  lat: number;
  lng: number;
  name: string;
  type?: 'start' | 'destination' | 'stop';
}

interface TourMapProps {
  coordinates?: MapCoordinate[] | null;
  tourName: string;
  className?: string;
}

export function TourMap({ coordinates, tourName, className }: TourMapProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Start collapsed on mobile
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [isMobile]);

  // Import Leaflet CSS only when component mounts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);
    setMapLoaded(true);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Don't render if no coordinates
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  // Calculate center and bounds
  const center: [number, number] = [
    coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length,
    coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length
  ];

  // Create polyline path
  const routePath = coordinates.map(c => [c.lat, c.lng] as [number, number]);

  return (
    <div className={cn("mt-8", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sunset" />
              <span className="font-serif text-lg font-semibold">Tour Route Map</span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <div className="rounded-xl overflow-hidden border border-border shadow-card">
            {mapLoaded ? (
              <Suspense fallback={<ContentLoading text="Loading map..." className="h-[400px]" />}>
                <MapWrapper 
                  center={center} 
                  coordinates={coordinates} 
                  routePath={routePath}
                  tourName={tourName}
                />
              </Suspense>
            ) : (
              <ContentLoading text="Loading map..." className="h-[400px]" />
            )}
          </div>
          
          {/* Location Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {coordinates.map((coord, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full"
              >
                <span className={cn(
                  "w-3 h-3 rounded-full",
                  index === 0 ? "bg-green-500" : 
                  index === coordinates.length - 1 ? "bg-red-500" : "bg-sunset"
                )} />
                <span className="text-muted-foreground">{coord.name}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Separate component for the map to handle Leaflet imports
function MapWrapper({ 
  center, 
  coordinates, 
  routePath,
  tourName 
}: { 
  center: [number, number]; 
  coordinates: MapCoordinate[];
  routePath: [number, number][];
  tourName: string;
}) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    import('leaflet').then(leaflet => {
      // Fix default marker icons
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
      setL(leaflet);
    });
  }, []);

  if (!L) return <ContentLoading text="Initializing map..." className="h-[400px]" />;

  // Create custom icons
  const createIcon = (color: string) => new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Suspense fallback={<ContentLoading text="Loading map..." className="h-[400px]" />}>
      <LazyMapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
      >
        <LazyTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route line */}
        <LazyPolyline
          positions={routePath}
          pathOptions={{
            color: 'hsl(32, 60%, 65%)',
            weight: 3,
            opacity: 0.8,
            dashArray: '10, 10'
          }}
        />
        
        {/* Markers */}
        {coordinates.map((coord, index) => (
          <LazyMarker
            key={index}
            position={[coord.lat, coord.lng]}
            icon={createIcon(
              index === 0 ? '#22c55e' : 
              index === coordinates.length - 1 ? '#ef4444' : '#d4a373'
            )}
          >
            <LazyPopup>
              <div className="text-center">
                <p className="font-semibold">{coord.name}</p>
                <p className="text-xs text-gray-500">
                  {index === 0 ? 'Start' : 
                   index === coordinates.length - 1 ? 'End' : `Stop ${index}`}
                </p>
              </div>
            </LazyPopup>
          </LazyMarker>
        ))}
      </LazyMapContainer>
    </Suspense>
  );
}
