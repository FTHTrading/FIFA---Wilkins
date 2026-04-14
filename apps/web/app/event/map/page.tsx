'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import { Search, X, Navigation as NavIcon, ChevronUp, ChevronDown, Sparkles, ExternalLink } from 'lucide-react';
import { Badge } from '@wilkins/ui';
import { useGuestSession } from '@/components/providers/guest-session-provider';
import { useConciergeStore, type MapPin } from '@/lib/store';
import { fetchVenuePois, type VenuePoi } from '@/lib/api';
import 'mapbox-gl/dist/mapbox-gl.css';

const VENUE_ID = 'mercedes-benz-stadium';
const ATLANTA_CENTER = { latitude: 33.7554, longitude: -84.4005, zoom: 15 };

// Pin colors per source
const PIN_COLORS: Record<string, string> = {
  venue: '#C9A84C',       // gold
  nearby: '#3B82F6',      // electric blue
  geocoding: '#059669',   // emerald
  sponsored: '#C026D3',   // fuchsia
};

const CATEGORY_ICONS: Record<string, string> = {
  GATE: '🚪', RESTROOM: '🚻', FIRST_AID: '🏥', CONCESSION: '🍔',
  MERCHANDISE: '🛍️', INFO: 'ℹ️', TRANSPORT: '🚌', PARKING: '🅿️',
  SPONSOR_ZONE: '⭐', restaurant: '🍽️', hospital: '🏥', pharmacy: '💊',
  hotel: '🏨', transit: '🚇', place: '📍',
};

export default function MapPage() {
  const mapRef = useRef<MapRef>(null);
  const { languageCode } = useGuestSession();
  const searchParams = useSearchParams();

  // Concierge store (populated from home page intent chips)
  const { pins, sponsors, response, isLoading, showResults, query, search, selectPin, selectedPinId, clearResults } = useConciergeStore();

  // Venue POIs (always loaded)
  const [venuePois, setVenuePois] = useState<VenuePoi[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchText, setSearchText] = useState('');
  const [panelOpen, setPanelOpen] = useState(true);

  // Load venue POIs on mount
  useEffect(() => {
    fetchVenuePois(VENUE_ID, languageCode).then(setVenuePois).catch(() => setVenuePois([]));
  }, [languageCode]);

  // Auto-fit map when concierge pins arrive
  useEffect(() => {
    if (pins.length > 0 && mapRef.current) {
      const map = mapRef.current.getMap();
      const bounds = new (window as any).mapboxgl.LngLatBounds();
      for (const pin of pins) {
        bounds.extend([pin.longitude, pin.latitude]);
      }
      map.fitBounds(bounds, { padding: 60, maxZoom: 16, duration: 800 });
    }
  }, [pins]);

  // Category list from venue POIs
  const categories = useMemo(() => {
    const unique = Array.from(new Set(venuePois.map((p) => p.category)));
    return ['ALL', ...unique];
  }, [venuePois]);

  // Filter venue POIs (only when not showing concierge results)
  const filteredVenuePois = useMemo(() => {
    if (showResults) return [];
    return venuePois.filter((poi) => {
      const matchesCat = selectedCategory === 'ALL' || poi.category === selectedCategory;
      return matchesCat;
    });
  }, [venuePois, selectedCategory, showResults]);

  // All markers to render
  const allMarkers: MapPin[] = useMemo(() => {
    if (showResults) return pins;
    return filteredVenuePois.map((p) => ({
      id: `venue-${p.id}`,
      name: p.localizedName ?? p.name,
      latitude: p.latitude,
      longitude: p.longitude,
      category: p.category,
      source: 'venue' as const,
      isSponsored: p.isSponsored,
    }));
  }, [showResults, pins, filteredVenuePois]);

  const selectedMarker = allMarkers.find((m) => m.id === selectedPinId) ?? null;

  async function handleSearch() {
    if (!searchText.trim()) return;
    await search(searchText.trim(), languageCode, VENUE_ID);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col relative">
      {/* Map */}
      <div className="relative flex-1">
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={ATLANTA_CENTER}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" />

          {allMarkers.map((pin) => (
            <Marker
              key={pin.id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              anchor="bottom"
              onClick={(e) => { e.originalEvent.stopPropagation(); selectPin(pin.id); }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg text-sm"
                  style={{
                    backgroundColor: pin.isSponsored ? PIN_COLORS.sponsored : PIN_COLORS[pin.source],
                    borderColor: '#0A0A0F',
                  }}
                >
                  {CATEGORY_ICONS[pin.category] ?? '📍'}
                </div>
              </div>
            </Marker>
          ))}

          {selectedMarker && (
            <Popup
              latitude={selectedMarker.latitude}
              longitude={selectedMarker.longitude}
              onClose={() => selectPin(null)}
              closeButton closeOnClick={false} anchor="top"
              className="wilkins-popup"
            >
              <div className="text-sm min-w-[140px]">
                <p className="font-semibold text-slate-900">{selectedMarker.name}</p>
                <p className="text-xs text-slate-500 capitalize">{selectedMarker.category.toLowerCase().replace('_', ' ')}</p>
                {selectedMarker.isSponsored && (
                  <span className="mt-1 inline-block rounded bg-fuchsia-100 px-1.5 py-0.5 text-2xs font-semibold text-fuchsia-700">
                    Official Partner
                  </span>
                )}
              </div>
            </Popup>
          )}
        </Map>

        {/* Floating search bar on map */}
        <div className="absolute top-3 left-3 right-3 z-10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="Search — food, restrooms, hospital…"
                className="w-full rounded-xl border border-brand-border bg-brand-black/90 backdrop-blur-md pl-10 pr-4 py-2.5 text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-gold focus:outline-none shadow-xl"
              />
            </div>
            {showResults && (
              <button
                type="button"
                onClick={clearResults}
                className="shrink-0 rounded-xl bg-brand-surface/90 backdrop-blur-md border border-brand-border px-3 text-brand-muted hover:text-brand-text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-brand-black/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-xl bg-brand-surface border border-brand-border px-5 py-3">
              <Sparkles className="h-5 w-5 text-brand-gold animate-pulse" />
              <span className="text-sm font-medium text-brand-text">Finding results…</span>
            </div>
          </div>
        )}
      </div>

      {/* Results panel (slides up from bottom) */}
      {showResults && response && (
        <div className={`border-t border-brand-border bg-brand-black transition-all duration-500 ease-out ${panelOpen ? 'max-h-[45vh]' : 'max-h-12'} overflow-hidden`}>
          {/* Panel handle */}
          <button
            type="button"
            onClick={() => setPanelOpen(!panelOpen)}
            className="flex w-full items-center justify-between px-4 py-2 text-brand-muted hover:text-brand-text transition-colors"
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              {response.intent.intent} — {pins.length} result{pins.length !== 1 && 's'}
            </span>
            {panelOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {panelOpen && (
            <div className="overflow-y-auto px-4 pb-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ maxHeight: 'calc(45vh - 3rem)' }}>
              {/* Explanation */}
              <p className="text-xs text-brand-muted italic">{response.explanation}</p>

              {/* Sponsor cards (priority placement) */}
              {sponsors.length > 0 && (
                <div className="space-y-2">
                  {sponsors.map((s, idx) => (
                    <div
                      key={s.id}
                      className="group relative rounded-xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/30 via-slate-900/80 to-violet-950/20 p-3 transition-all duration-300 hover:border-fuchsia-400/50 hover:shadow-lg hover:shadow-fuchsia-500/10 hover:-translate-y-0.5"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {/* Gradient accent line */}
                      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="gold" className="text-2xs">Official Partner</Badge>
                            <span className="text-2xs text-brand-muted">{s.badge}</span>
                          </div>
                          <p className="text-sm font-semibold text-brand-text group-hover:text-white transition-colors">{s.name}</p>
                          <p className="text-xs text-brand-muted mt-0.5">{s.reason}</p>
                        </div>
                        {s.ctaUrl && (
                          <a
                            href={s.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 ml-3 rounded-lg bg-brand-gold/20 p-2 text-brand-gold hover:bg-brand-gold/30 transition-colors hover:scale-105 active:scale-95"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      {s.ctaText && (
                        <p className="mt-2 text-xs font-medium text-brand-gold">{s.ctaText}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Result list */}
              {pins.map((pin, idx) => (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => {
                    selectPin(pin.id);
                    mapRef.current?.flyTo({ center: [pin.longitude, pin.latitude], zoom: 16, duration: 600 });
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:-translate-y-px hover:shadow-md ${
                    selectedPinId === pin.id
                      ? 'border-brand-gold bg-brand-gold/10 shadow-sm shadow-brand-gold/5'
                      : 'border-brand-border bg-brand-surface hover:border-brand-gold/30 hover:shadow-brand-gold/5'
                  }`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                    style={{ backgroundColor: `${PIN_COLORS[pin.source]}20` }}
                  >
                    {CATEGORY_ICONS[pin.category] ?? '📍'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-text truncate">{pin.name}</p>
                    <p className="text-xs text-brand-muted capitalize">{pin.category.toLowerCase().replace('_', ' ')}</p>
                  </div>
                  {pin.isSponsored && (
                    <Badge variant="gold" className="text-2xs shrink-0">Promoted</Badge>
                  )}
                  <NavIcon className="h-3.5 w-3.5 shrink-0 text-brand-muted" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category chips (only when NOT showing concierge results) */}
      {!showResults && (
        <div className="border-t border-brand-border bg-brand-black p-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs border transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedCategory === cat
                    ? 'border-brand-gold text-brand-gold bg-brand-gold/10 shadow-sm shadow-brand-gold/10'
                    : 'border-brand-border text-brand-muted bg-brand-surface hover:border-brand-gold/30 hover:text-brand-text'
                }`}
              >
                {CATEGORY_ICONS[cat] ?? ''} {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
