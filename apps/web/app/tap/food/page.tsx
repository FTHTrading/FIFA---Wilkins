'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Utensils, Star, MapPin, Clock, ChevronRight, Filter } from 'lucide-react';

// ─── Data (mirrors concierge service output) ─────────────────────────────────

type DietaryTag = 'HALAL' | 'VEGETARIAN' | 'VEGAN' | 'GLUTEN_FREE' | 'KOSHER';

interface FoodSpot {
  id: string;
  name: string;
  cuisine: string;
  cuisineEmoji: string;
  dietary: DietaryTag[];
  distance: string;
  walkTime: string;
  rating: number;
  priceRange: number;
  isOpen: boolean;
  isSponsor?: boolean;
  sponsorName?: string;
  couponCode?: string;
  description: string;
}

const FOOD_SPOTS: FoodSpot[] = [
  {
    id: '1',
    name: 'Al-Noor Halal Grill',
    cuisine: 'Middle Eastern',
    cuisineEmoji: '🥙',
    dietary: ['HALAL'],
    distance: '0.4 km',
    walkTime: '5 min',
    rating: 4.7,
    priceRange: 2,
    isOpen: true,
    description: 'Shawarma, falafel, hummus — family-style platters available',
  },
  {
    id: '2',
    name: 'Centennial Eats — Coca-Cola Fan Zone',
    cuisine: 'American',
    cuisineEmoji: '🍔',
    dietary: ['VEGETARIAN'],
    distance: '0.1 km',
    walkTime: '2 min',
    rating: 4.2,
    priceRange: 2,
    isOpen: true,
    isSponsor: true,
    sponsorName: 'Coca-Cola',
    couponCode: 'FIFATAP26',
    description: 'Stadium concourse dining with free Coca-Cola promo',
  },
  {
    id: '3',
    name: 'Casa de México',
    cuisine: 'Latin American',
    cuisineEmoji: '🌮',
    dietary: ['VEGETARIAN'],
    distance: '0.7 km',
    walkTime: '9 min',
    rating: 4.5,
    priceRange: 2,
    isOpen: true,
    description: 'Authentic tacos, enchiladas, fresh guacamole',
  },
  {
    id: '4',
    name: 'Mumbai Bites',
    cuisine: 'South Asian',
    cuisineEmoji: '🍛',
    dietary: ['VEGETARIAN', 'HALAL'],
    distance: '1.1 km',
    walkTime: '14 min',
    rating: 4.8,
    priceRange: 2,
    isOpen: true,
    description: 'Biryani, tandoori, thali sets — highly rated for spice lovers',
  },
  {
    id: '5',
    name: 'Seoul Garden',
    cuisine: 'East Asian',
    cuisineEmoji: '🍜',
    dietary: ['VEGAN'],
    distance: '0.6 km',
    walkTime: '8 min',
    rating: 4.6,
    priceRange: 2,
    isOpen: false,
    description: 'Korean BBQ, kimchi, bibimbap — opens at 5:00 PM',
  },
  {
    id: '6',
    name: 'Lagos Kitchen',
    cuisine: 'West African',
    cuisineEmoji: '🍲',
    dietary: ['HALAL'],
    distance: '0.9 km',
    walkTime: '12 min',
    rating: 4.4,
    priceRange: 1,
    isOpen: true,
    description: 'Jollof rice, suya, puff-puff — authentic flavors',
  },
];

const FILTERS = [
  { label: 'All', value: 'all', emoji: '' },
  { label: 'Halal', value: 'HALAL', emoji: '🥩' },
  { label: 'Vegetarian', value: 'VEGETARIAN', emoji: '🥦' },
  { label: 'Vegan', value: 'VEGAN', emoji: '🌱' },
  { label: 'Open Now', value: 'open', emoji: '🟢' },
] as const;

const PRICE_DOTS = (n: number) => '●'.repeat(n) + '○'.repeat(3 - n);

// ─── Component ────────────────────────────────────────────────────────────────

export default function FoodPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const visible = FOOD_SPOTS.filter((s) => {
    if (activeFilter === 'open') return s.isOpen;
    if (activeFilter !== 'all') return s.dietary.includes(activeFilter as DietaryTag);
    return true;
  });

  // Sort: sponsors first, then by rating
  const sorted = [...visible].sort((a, b) => {
    if (a.isSponsor && !b.isSponsor) return -1;
    if (!a.isSponsor && b.isSponsor) return 1;
    return b.rating - a.rating;
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-6 animate-fade-in">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="mb-6">
        <Link href="/tap" className="mb-3 inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-text transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <h1 className="font-display text-2xl font-black text-white">
          <Utensils className="mr-2 inline h-6 w-6 text-amber-400" />
          Food &amp; Drink
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Culturally relevant dining near Mercedes-Benz Stadium
        </p>
      </div>

      {/* ── Filters ───────────────────────────────────────── */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActiveFilter(f.value)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === f.value
                ? 'bg-brand-gold text-brand-black'
                : 'border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text'
            }`}
          >
            {f.emoji && <span className="mr-1">{f.emoji}</span>}
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Results Count ─────────────────────────────────── */}
      <p className="mb-3 text-xs text-brand-muted">
        {sorted.length} place{sorted.length !== 1 ? 's' : ''} found
      </p>

      {/* ── Food Cards ────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-6">
        {sorted.map((spot) => (
          <div
            key={spot.id}
            className={`rounded-2xl border p-4 transition-all hover:shadow-brand ${
              spot.isSponsor
                ? 'border-fuchsia-500/40 bg-gradient-to-r from-fuchsia-950/20 to-brand-surface'
                : 'border-brand-border bg-brand-surface'
            }`}
          >
            {/* Sponsor badge */}
            {spot.isSponsor && (
              <div className="mb-2 flex items-center gap-1.5">
                <span className="rounded bg-fuchsia-500/20 px-2 py-0.5 text-2xs font-bold text-fuchsia-400">
                  ⭐ Official Partner — {spot.sponsorName}
                </span>
              </div>
            )}

            <div className="flex items-start gap-3">
              {/* Cuisine emoji */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-2xl">
                {spot.cuisineEmoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-bold text-white truncate">{spot.name}</p>
                  {spot.isOpen ? (
                    <span className="shrink-0 text-2xs font-semibold text-brand-success">Open</span>
                  ) : (
                    <span className="shrink-0 text-2xs font-semibold text-brand-muted">Closed</span>
                  )}
                </div>

                <p className="mt-0.5 text-2xs text-brand-muted">{spot.cuisine}</p>
                <p className="mt-1 text-xs text-brand-muted/80 leading-snug">{spot.description}</p>

                {/* Meta row */}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-2xs text-brand-muted">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-brand-gold" />
                    {spot.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {spot.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {spot.walkTime}
                  </span>
                  <span className="font-mono">{PRICE_DOTS(spot.priceRange)}</span>
                </div>

                {/* Dietary tags */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {spot.dietary.map((d) => (
                    <span
                      key={d}
                      className="rounded-full bg-brand-navy px-2 py-0.5 text-2xs font-medium text-brand-text"
                    >
                      {d === 'HALAL' && '🥩 '}
                      {d === 'VEGETARIAN' && '🥦 '}
                      {d === 'VEGAN' && '🌱 '}
                      {d === 'GLUTEN_FREE' && '🌾 '}
                      {d === 'KOSHER' && '✡️ '}
                      {d.charAt(0) + d.slice(1).toLowerCase().replace('_', '-')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sponsor coupon */}
            {spot.isSponsor && spot.couponCode && (
              <div className="mt-3 rounded-lg border border-fuchsia-500/20 bg-fuchsia-950/20 p-2.5 text-center">
                <p className="text-2xs text-fuchsia-300">
                  Show code for special offer:{' '}
                  <span className="font-mono font-bold text-brand-gold">{spot.couponCode}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── What's Next ───────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-electric/30 bg-gradient-to-br from-blue-600/10 to-brand-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-electric mb-2">
          What&#39;s next?
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/tap/directions" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
            <span className="text-sm text-brand-text">🗺️ Get directions to stadium</span>
            <ChevronRight className="h-4 w-4 text-brand-muted" />
          </Link>
          <Link href="/tap/rewards" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
            <span className="text-sm text-brand-text">🏆 Earn your Foodie Passport badge</span>
            <ChevronRight className="h-4 w-4 text-brand-muted" />
          </Link>
        </div>
      </div>
    </div>
  );
}
