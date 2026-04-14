'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import Map, { Marker, NavigationControl, Popup, Source, Layer } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import {
  Navigation as NavIcon,
  Phone,
  MessageSquare,
  TriangleAlert,
  ExternalLink,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Badge } from '@wilkins/ui';
import type { ConciergeResponse, SponsorRec } from '@/lib/api';
import type { MapPin } from '@/lib/store';
import 'mapbox-gl/dist/mapbox-gl.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const ATLANTA_CENTER = { latitude: 33.7554, longitude: -84.4005, zoom: 15 };
const PHONE_NUMBER = '1-888-827-3432';
const SMS_BODY = 'HELP'; // default SMS body
const MAX_SUGGESTIONS = 3;

const PIN_COLORS: Record<string, string> = {
  venue: '#C9A84C',
  nearby: '#3B82F6',
  geocoding: '#059669',
  sponsored: '#C026D3',
};

const CATEGORY_ICONS: Record<string, string> = {
  GATE: '🚪', RESTROOM: '🚻', FIRST_AID: '🏥', CONCESSION: '🍔',
  MERCHANDISE: '🛍️', INFO: 'ℹ️', TRANSPORT: '🚌', PARKING: '🅿️',
  SPONSOR_ZONE: '⭐', restaurant: '🍽️', hospital: '🏥', pharmacy: '💊',
  hotel: '🏨', transit: '🚇', place: '📍',
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface TapResultsViewProps {
  heading: string;
  subtitle: string;
  icon: string;
  isLoading: boolean;
  error: string | null;
  response: ConciergeResponse | null;
  pins: MapPin[];
  sponsors: SponsorRec[];
  lang: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function TapResultsView({
  heading,
  subtitle,
  icon,
  isLoading,
  error,
  response,
  pins,
  sponsors,
  lang,
}: TapResultsViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  // Auto-fit map to pins
  useEffect(() => {
    if (pins.length > 0 && mapRef.current) {
      const map = mapRef.current.getMap();
      const bounds = new (window as any).mapboxgl.LngLatBounds();
      for (const pin of pins) {
        bounds.extend([pin.longitude, pin.latitude]);
      }
      map.fitBounds(bounds, { padding: 50, maxZoom: 16, duration: 800 });
    }
  }, [pins]);

  const selectedMarker = useMemo(
    () => pins.find((m) => m.id === selectedPinId) ?? null,
    [pins, selectedPinId],
  );

  const topSuggestions = useMemo(() => pins.slice(0, MAX_SUGGESTIONS), [pins]);
  const topSponsor = useMemo(() => sponsors[0] ?? null, [sponsors]);
  const topDestination = topSuggestions[0] ?? null;

  // Best-effort user location for route guidance line.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // Ignore denied/failed geolocation and keep map behavior unchanged.
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 },
    );
  }, []);

  const routeLineFeature = useMemo(() => {
    if (!userLocation || !topDestination) return null;
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [userLocation.longitude, userLocation.latitude],
          [topDestination.longitude, topDestination.latitude],
        ],
      },
      properties: {},
    };
  }, [userLocation, topDestination]);

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="h-8 w-8 text-brand-gold animate-spin" />
        <div className="text-center">
          <p className="text-sm font-semibold text-brand-text">Finding your way…</p>
          <p className="mt-1 text-xs text-brand-muted">{subtitle}</p>
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-2xl border border-brand-emergency/30 bg-brand-emergency/5 p-6 text-center">
          <p className="text-lg font-bold text-brand-text">Something went wrong</p>
          <p className="mt-2 text-sm text-brand-muted">{error}</p>
          <SmsFallback className="mt-6" />
        </div>
      </div>
    );
  }

  // ─── Empty / no response ────────────────────────────────────────────────────
  if (!response) return null;

  return (
    <div className="flex flex-col gap-0">
      {/* ── Map ──────────────────────────────────────────────────────────────── */}
      <div className="relative h-[40vh] w-full">
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={ATLANTA_CENTER}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-right" showCompass={false} />

          {routeLineFeature && (
            <Source
              id="tap-route-line"
              type="geojson"
              data={{ type: 'FeatureCollection', features: [routeLineFeature] }}
            >
              <Layer
                id="tap-route-line-layer"
                type="line"
                paint={{
                  'line-color': '#22D3EE',
                  'line-width': 4,
                  'line-opacity': 0.9,
                  'line-dasharray': [1, 1.25],
                }}
              />
            </Source>
          )}

          {userLocation && (
            <Marker
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              anchor="center"
            >
              <div className="relative flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-4 w-4 rounded-full bg-cyan-300/50 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400 border border-cyan-200" />
              </div>
            </Marker>
          )}

          {pins.map((pin) => {
            const isDestination = topDestination?.id === pin.id;
            return (
              <Marker
                key={pin.id}
                latitude={pin.latitude}
                longitude={pin.longitude}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedPinId(pin.id);
                }}
              >
                <div className="flex flex-col items-center">
                  {isDestination && (
                    <span className="h-2 w-2 rounded-full bg-cyan-300 mb-1 animate-pulse" />
                  )}
                  <div
                    className={`flex items-center justify-center rounded-full border-2 shadow-lg text-sm ${
                      isDestination ? 'h-10 w-10 ring-2 ring-cyan-300/70' : 'h-8 w-8'
                    }`}
                    style={{
                      backgroundColor: pin.isSponsored
                        ? PIN_COLORS.sponsored
                        : PIN_COLORS[pin.source],
                      borderColor: '#0A0A0F',
                    }}
                  >
                    {CATEGORY_ICONS[pin.category] ?? '📍'}
                  </div>
                </div>
              </Marker>
            );
          })}

          {selectedMarker && (
            <Popup
              latitude={selectedMarker.latitude}
              longitude={selectedMarker.longitude}
              onClose={() => setSelectedPinId(null)}
              closeButton
              closeOnClick={false}
              anchor="top"
              className="wilkins-popup"
            >
              <div className="text-sm min-w-[140px]">
                <p className="font-semibold text-slate-900">{selectedMarker.name}</p>
                <p className="text-xs text-slate-500 capitalize">
                  {selectedMarker.category.toLowerCase().replace('_', ' ')}
                </p>
                {selectedMarker.isSponsored && (
                  <span className="mt-1 inline-block rounded bg-fuchsia-100 px-1.5 py-0.5 text-2xs font-semibold text-fuchsia-700">
                    Official Partner
                  </span>
                )}
              </div>
            </Popup>
          )}
        </Map>

        {/* Next step overlay on map */}
        {topSuggestions[0] && (
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <button
              type="button"
              onClick={() => {
                const pin = topSuggestions[0]!;
                setSelectedPinId(pin.id);
                mapRef.current?.flyTo({
                  center: [pin.longitude, pin.latitude],
                  zoom: 16,
                  duration: 600,
                });
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-brand-gold/40 bg-brand-black/90 backdrop-blur-md p-3 shadow-xl transition-all active:scale-[0.98]"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ backgroundColor: `${PIN_COLORS[topSuggestions[0].source]}20` }}
              >
                {CATEGORY_ICONS[topSuggestions[0].category] ?? '📍'}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                  Next Step
                </p>
                <p className="text-sm font-medium text-brand-text truncate">
                  {topSuggestions[0].name}
                </p>
              </div>
              <NavIcon className="h-5 w-5 shrink-0 text-brand-gold" />
            </button>
          </div>
        )}
      </div>

      {/* ── Results below map ────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-lg px-4 py-4 space-y-3">
        {/* Explanation */}
        {response.explanation && (
          <p className="text-xs text-brand-muted italic">{response.explanation}</p>
        )}

        {/* Top 3 suggestions */}
        {topSuggestions.map((pin, idx) => (
          <button
            key={pin.id}
            type="button"
            onClick={() => {
              setSelectedPinId(pin.id);
              mapRef.current?.flyTo({
                center: [pin.longitude, pin.latitude],
                zoom: 16,
                duration: 600,
              });
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-brand-border bg-brand-surface p-3 text-left transition-all duration-200 hover:border-brand-gold/40 hover:-translate-y-px hover:shadow-md active:scale-[0.98]"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
              style={{ backgroundColor: `${PIN_COLORS[pin.source]}20` }}
            >
              {CATEGORY_ICONS[pin.category] ?? '📍'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-text truncate">{pin.name}</p>
              <p className="text-xs text-brand-muted capitalize">
                {pin.category.toLowerCase().replace('_', ' ')}
              </p>
            </div>
            {pin.isSponsored && (
              <Badge variant="gold" className="text-2xs shrink-0">
                Promoted
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 shrink-0 text-brand-muted" />
          </button>
        ))}

        {/* Sponsor / reward card (1 max) */}
        {topSponsor && (
          <div className="relative rounded-xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/30 via-slate-900/80 to-violet-950/20 p-4 transition-all hover:border-fuchsia-400/50 hover:shadow-lg hover:shadow-fuchsia-500/10">
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="gold" className="text-2xs">
                    Official Partner
                  </Badge>
                  <span className="text-2xs text-brand-muted">{topSponsor.badge}</span>
                </div>
                <p className="text-sm font-semibold text-brand-text">{topSponsor.name}</p>
                <p className="text-xs text-brand-muted mt-0.5">{topSponsor.reason}</p>
              </div>
              {topSponsor.ctaUrl && (
                <a
                  href={topSponsor.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 ml-3 rounded-lg bg-brand-gold/20 p-2 text-brand-gold hover:bg-brand-gold/30 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            {topSponsor.ctaText && (
              <p className="mt-2 text-xs font-medium text-brand-gold">{topSponsor.ctaText}</p>
            )}
          </div>
        )}

        {/* Emergency button — large, unmissable */}
        <a
          href="/event/emergency"
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-brand-emergency/50 bg-brand-emergency/10 px-4 py-4 text-brand-emergency font-bold text-base transition-all hover:bg-brand-emergency/20 hover:border-brand-emergency active:scale-[0.97] shadow-lg shadow-brand-emergency/5"
        >
          <TriangleAlert className="h-5 w-5 animate-pulse" />
          Emergency Assistance
        </a>

        {/* SMS / phone fallback */}
        <SmsFallback />
      </div>
    </div>
  );
}

// ─── SMS Fallback ─────────────────────────────────────────────────────────────
function SmsFallback({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className ?? ''}`}>
      <a
        href={`sms:${PHONE_NUMBER}?body=${encodeURIComponent(SMS_BODY)}`}
        className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm font-medium text-brand-text transition-all hover:border-brand-gold/40 active:scale-[0.97]"
      >
        <MessageSquare className="h-4 w-4 text-brand-electric" />
        Text for Help
      </a>
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="flex items-center gap-2 rounded-lg border border-brand-border bg-brand-surface px-4 py-2.5 text-sm font-medium text-brand-text transition-all hover:border-brand-gold/40 active:scale-[0.97]"
      >
        <Phone className="h-4 w-4 text-brand-gold" />
        {PHONE_NUMBER}
      </a>
    </div>
  );
}
