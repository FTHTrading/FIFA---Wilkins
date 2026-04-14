'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchConcierge } from '@/lib/api';
import type { ConciergeResponse, SponsorRec } from '@/lib/api';
import type { MapPin } from '@/lib/store';
import { TapResultsView } from '@/components/tap/tap-results-view';
import { resolveIntent, detectLanguage, TAP_MODES } from '@/components/tap/tap-intent-map';
import { useGuestSession } from '@/components/providers/guest-session-provider';

// ─── Build pins from API response (same logic as store) ──────────────────────
function buildPins(res: ConciergeResponse): MapPin[] {
  const pins: MapPin[] = [];
  for (const poi of res.venuePois) {
    pins.push({
      id: `venue-${poi.id}`,
      name: poi.localizedName ?? poi.name,
      latitude: poi.latitude,
      longitude: poi.longitude,
      category: poi.category,
      isSponsored: poi.isSponsored,
      source: 'venue',
    });
  }
  for (const a of res.nearbyAmenities) {
    pins.push({
      id: `nearby-${a.id}`,
      name: a.name,
      latitude: a.latitude,
      longitude: a.longitude,
      category: a.type,
      source: 'nearby',
    });
  }
  for (const g of res.geocoding) {
    pins.push({
      id: `geo-${g.placeId}`,
      name: g.placeName,
      latitude: g.latitude,
      longitude: g.longitude,
      category: g.category ?? 'place',
      source: 'geocoding',
    });
  }
  return pins;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TapModePage() {
  const params = useParams<{ mode: string }>();
  const searchParams = useSearchParams();
  const { setLanguage } = useGuestSession();

  const mode = params.mode;
  const zone = searchParams.get('zone') ?? undefined;
  const langParam = searchParams.get('lang');
  const venueId =
    searchParams.get('venueId') ??
    process.env.NEXT_PUBLIC_DEFAULT_VENUE_ID ??
    'mercedes-benz-stadium';

  const [lang, setLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ConciergeResponse | null>(null);
  const [pins, setPins] = useState<MapPin[]>([]);
  const [sponsors, setSponsors] = useState<SponsorRec[]>([]);
  const searchedRef = useRef(false);

  // Resolve intent from mode
  const intent = resolveIntent(mode, zone);

  // Auto-detect language and search on mount
  useEffect(() => {
    if (searchedRef.current) return;
    searchedRef.current = true;

    const detected = detectLanguage(langParam);
    setLang(detected);
    setLanguage(detected); // sync session provider

    if (!intent) {
      setIsLoading(false);
      setError(`Unknown mode: "${mode}". Use: directions, food, rewards, help, or vip.`);
      return;
    }

    fetchConcierge({ q: intent.query, lang: detected, venueId })
      .then((res) => {
        setResponse(res);
        setPins(buildPins(res));
        setSponsors(res.sponsorRecommendations);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Search failed');
        setIsLoading(false);
      });
  }, [intent, langParam, venueId, mode, setLanguage]);

  // Invalid mode — show error
  if (!TAP_MODES.has(mode)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-6xl mb-4">🚫</p>
        <p className="text-lg font-bold text-brand-text">Invalid scan</p>
        <p className="mt-2 text-sm text-brand-muted">
          This QR code doesn&apos;t match a known action.
        </p>
        <a
          href="/event"
          className="mt-6 inline-block rounded-xl bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition-all hover:bg-brand-gold/90"
        >
          Go to Event Home
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Mode hero banner */}
      <div className="border-b border-brand-border bg-brand-gradient">
        <div className="mx-auto max-w-lg px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/15 text-2xl shadow-lg shadow-brand-gold/10">
              {intent?.icon ?? '📍'}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold text-brand-text">
                {intent?.heading ?? 'Results'}
              </h1>
              <p className="text-sm text-brand-muted">{intent?.subtitle ?? ''}</p>
            </div>
          </div>
        </div>
      </div>

      <TapResultsView
        heading={intent?.heading ?? 'Results'}
        subtitle={intent?.subtitle ?? ''}
        icon={intent?.icon ?? '📍'}
        isLoading={isLoading}
        error={error}
        response={response}
        pins={pins}
        sponsors={sponsors}
        lang={lang}
      />
    </div>
  );
}
