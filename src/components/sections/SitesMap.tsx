'use client';

import { useMemo } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Card, CardHeader } from '@/components/ui/Card';
import { Site } from '@/lib/types';

interface SitesMapProps {
  sites: Site[];
  activeSiteId?: string;
}

const containerStyle = {
  width: '100%',
  height: '360px',
};

export function SitesMap({ sites, activeSiteId }: SitesMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  const center = useMemo(() => {
    if (activeSiteId) {
      const activeSite = sites.find((site) => site.id === activeSiteId);
      if (activeSite) return activeSite.coordinates;
    }
    return sites[0]?.coordinates ?? { lat: 37.7749, lng: -122.4194 };
  }, [activeSiteId, sites]);

  return (
    <Card className="p-4">
      <CardHeader title="Map" subtitle="Site locations" />
      <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">
        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <div className="flex h-[360px] items-center justify-center bg-gray-50 text-sm text-gray-600">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the interactive map.
          </div>
        ) : loadError ? (
          <div className="flex h-[360px] items-center justify-center bg-rose-50 text-sm text-rose-700">
            Failed to load Google Maps. Check network or API key configuration.
          </div>
        ) : isLoaded ? (
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6} options={{ disableDefaultUI: true }}>
            {sites.map((site) => (
              <Marker key={site.id} position={site.coordinates} label={site.name} />
            ))}
          </GoogleMap>
        ) : (
          <div className="flex h-[360px] items-center justify-center bg-gray-50 text-sm text-gray-600">
            Loading map...
          </div>
        )}
      </div>
    </Card>
  );
}
