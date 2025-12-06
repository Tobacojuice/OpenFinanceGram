import React, { useMemo, useState, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { useFloating, shift, offset, FloatingPortal } from '@floating-ui/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { X, Users, MapPin } from 'lucide-react';

interface University {
  id: string;
  name: string;
  country: string;
  region: string;
  channel_id: string;
  student_count: number;
  latitude: number | null;
  longitude: number | null;
  domain?: string | null;
}

interface UniversityMapProps {
  universities: University[];
  joinedChannels: string[];
  onJoinUniversity: (channelId: string) => void;
  onLeaveUniversity: (channelId: string) => void;
  mapboxToken?: string; // Keep for backwards compatibility but not used
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const REGION_COLORS: Record<string, string> = {
  'AMERICA': '#22c55e',
  'EMEA': '#3b82f6',
  'ASIA': '#f59e0b',
  'OTHERS': '#8b5cf6'
};

export default function UniversityMap({
  universities,
  joinedChannels,
  onJoinUniversity,
  onLeaveUniversity,
}: UniversityMapProps) {
  const [hoveredUniversity, setHoveredUniversity] = useState<University | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [activeRegion, setActiveRegion] = useState<string>('ALL');
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1,
  });

  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [offset(10), shift({ padding: 8 })],
  });

  // Filter universities with valid coordinates
  const filteredUniversities = useMemo(() => {
    return universities.filter(
      uni => uni.latitude != null && uni.longitude != null &&
      (activeRegion === 'ALL' || uni.region === activeRegion)
    );
  }, [universities, activeRegion]);

  const handleMarkerClick = useCallback((uni: University) => {
    setSelectedUniversity(uni);
    if (uni.longitude != null && uni.latitude != null) {
      setPosition({
        coordinates: [uni.longitude, uni.latitude],
        zoom: 4,
      });
    }
  }, []);

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  const flyToRegion = useCallback((region: string) => {
    setActiveRegion(region);
    const regionCenters: Record<string, { coordinates: [number, number]; zoom: number }> = {
      'ALL': { coordinates: [0, 20], zoom: 1 },
      'AMERICA': { coordinates: [-95, 40], zoom: 2 },
      'EMEA': { coordinates: [10, 50], zoom: 2.5 },
      'ASIA': { coordinates: [105, 25], zoom: 2 },
    };
    setPosition(regionCenters[region] || regionCenters['ALL']);
  }, []);

  const handleJoinLeave = useCallback(() => {
    if (!selectedUniversity) return;
    const isJoined = joinedChannels.includes(selectedUniversity.channel_id);
    if (isJoined) {
      onLeaveUniversity(selectedUniversity.channel_id);
    } else {
      onJoinUniversity(selectedUniversity.channel_id);
    }
  }, [selectedUniversity, joinedChannels, onJoinUniversity, onLeaveUniversity]);

  const regionCounts = useMemo(() => ({
    'ALL': universities.filter(u => u.latitude != null && u.longitude != null).length,
    'AMERICA': universities.filter(u => u.region === 'AMERICA' && u.latitude != null && u.longitude != null).length,
    'EMEA': universities.filter(u => u.region === 'EMEA' && u.latitude != null && u.longitude != null).length,
    'ASIA': universities.filter(u => u.region === 'ASIA' && u.latitude != null && u.longitude != null).length,
  }), [universities]);

  // Memoize markers for performance
  const markers = useMemo(() => {
    return filteredUniversities.map((uni) => {
      if (uni.longitude == null || uni.latitude == null) return null;
      
      const isJoined = joinedChannels.includes(uni.channel_id);
      const color = REGION_COLORS[uni.region] || '#8b5cf6';
      
      return (
        <Marker
          key={uni.id}
          coordinates={[uni.longitude, uni.latitude]}
        >
          <circle
            r={isJoined ? 6 : 4}
            fill={color}
            stroke="white"
            strokeWidth={1.5}
            className="cursor-pointer transition-all duration-200 hover:scale-150"
            style={{
              filter: `drop-shadow(0 0 ${isJoined ? '8px' : '4px'} ${color})`,
            }}
            onMouseEnter={(e) => {
              refs.setReference(e.currentTarget);
              setHoveredUniversity(uni);
            }}
            onMouseLeave={() => setHoveredUniversity(null)}
            onClick={() => handleMarkerClick(uni)}
            aria-label={`${uni.name} - ${uni.student_count || 'N/A'} students`}
            data-testid={`university-marker-${uni.id}`}
          />
        </Marker>
      );
    });
  }, [filteredUniversities, joinedChannels, refs, handleMarkerClick]);

  return (
    <div className="relative w-full h-full min-h-[500px] bg-slate-900 rounded-lg overflow-hidden">
      {/* Map */}
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{
          scale: 200,
          center: [0, 0],
        }}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          maxZoom={8}
          minZoom={1}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#334155"
                  stroke="#475569"
                  strokeWidth={0.5}
                  className="transition-colors duration-200 hover:fill-slate-500 outline-none"
                  tabIndex={-1}
                />
              ))
            }
          </Geographies>
          {markers}
        </ZoomableGroup>
      </ComposableMap>

      {/* Region Filter */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
        {(['ALL', 'AMERICA', 'EMEA', 'ASIA'] as const).map(region => (
          <Button
            key={region}
            variant={activeRegion === region ? "default" : "secondary"}
            size="sm"
            onClick={() => flyToRegion(region)}
            className="mono text-xs"
            style={{
              backgroundColor: activeRegion === region 
                ? (region === 'ALL' ? undefined : REGION_COLORS[region]) 
                : undefined
            }}
          >
            {region}
            <Badge variant="outline" className="ml-1 text-[10px]">
              {regionCounts[region]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border">
        <div className="text-xs font-bold mono mb-2">REGIONS</div>
        <div className="space-y-1">
          {Object.entries(REGION_COLORS).map(([region, color]) => (
            <div key={region} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }}
              />
              <span className="mono">{region}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredUniversity && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="pointer-events-none z-50 bg-slate-900/95 text-white px-3 py-2 rounded-lg text-sm shadow-xl border border-slate-700"
          >
            <div className="font-semibold">{hoveredUniversity.name}</div>
            <div className="text-slate-300 text-xs">
              {hoveredUniversity.student_count?.toLocaleString() || 'N/A'} students
            </div>
            <div className="text-slate-400 text-xs">{hoveredUniversity.country}</div>
          </div>
        </FloatingPortal>
      )}

      {/* Selected University Card */}
      {selectedUniversity && (
        <Card className="absolute bottom-4 right-4 z-10 w-80 bg-background/95 backdrop-blur-sm border-2 border-primary/50 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <Badge 
                style={{ backgroundColor: REGION_COLORS[selectedUniversity.region] }}
                className="text-white text-xs"
              >
                {selectedUniversity.region}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setSelectedUniversity(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <h3 className="font-bold text-lg mono mb-1">{selectedUniversity.name}</h3>
          <p className="text-muted-foreground text-sm mb-3">{selectedUniversity.country}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className="mono">{selectedUniversity.student_count?.toLocaleString() || 'N/A'} students</span>
            </div>
            {joinedChannels.includes(selectedUniversity.channel_id) && (
              <Badge variant="default" className="text-xs">
                Joined
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              className="flex-1 mono"
              variant={joinedChannels.includes(selectedUniversity.channel_id) ? "secondary" : "default"}
              onClick={handleJoinLeave}
            >
              {joinedChannels.includes(selectedUniversity.channel_id) ? 'Leave Channel' : 'Join Channel'}
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Overlay */}
      <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
        <div className="text-xs mono">
          <span className="text-primary font-bold">{regionCounts[activeRegion]}</span>
          <span className="text-muted-foreground ml-1">universities</span>
        </div>
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-4 right-4 z-0 text-xs text-slate-500 mono">
        Scroll to zoom • Drag to pan
      </div>
    </div>
  );
}
