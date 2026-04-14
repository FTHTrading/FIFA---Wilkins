'use client';

import { create } from 'zustand';
import type { ConciergeResponse, VenuePoi, GeoResult, SponsorRec } from '@/lib/api';
import { fetchConcierge } from '@/lib/api';

export interface MapPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  isSponsored?: boolean;
  source: 'venue' | 'nearby' | 'geocoding';
}

interface ConciergeState {
  // query
  query: string;
  isLoading: boolean;
  error: string | null;

  // results
  response: ConciergeResponse | null;
  pins: MapPin[];
  sponsors: SponsorRec[];

  // map view
  selectedPinId: string | null;
  showResults: boolean;

  // actions
  setQuery: (q: string) => void;
  search: (q: string, lang: string, venueId: string, lat?: number, lng?: number) => Promise<void>;
  selectPin: (id: string | null) => void;
  clearResults: () => void;
}

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

export const useConciergeStore = create<ConciergeState>((set) => ({
  query: '',
  isLoading: false,
  error: null,
  response: null,
  pins: [],
  sponsors: [],
  selectedPinId: null,
  showResults: false,

  setQuery: (q) => set({ query: q }),

  search: async (q, lang, venueId, lat, lng) => {
    set({ isLoading: true, error: null, query: q, showResults: true });
    try {
      const res = await fetchConcierge({ q, lang, venueId, lat, lng });
      set({
        response: res,
        pins: buildPins(res),
        sponsors: res.sponsorRecommendations,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Search failed', isLoading: false });
    }
  },

  selectPin: (id) => set({ selectedPinId: id }),

  clearResults: () =>
    set({
      query: '',
      response: null,
      pins: [],
      sponsors: [],
      selectedPinId: null,
      showResults: false,
      error: null,
    }),
}));
