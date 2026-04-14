'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, MessageSquare, TriangleAlert, Utensils, Search, Sparkles, Trophy } from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@wilkins/ui';
import { useGuestSession } from '@/components/providers/guest-session-provider';
import { useConciergeStore } from '@/lib/store';
import { useState } from 'react';

// ─── Intent Chips ─────────────────────────────────────────────────────────────
const INTENT_CHIPS = [
  { query: 'Where is the nearest restroom?', icon: '🚻', label: 'Find Restroom', intent: 'restroom' },
  { query: 'halal food near the stadium', icon: '🍽️', label: 'Food From Home', intent: 'food-cultural' },
  { query: 'I need medical help', icon: '🏥', label: 'Need Help', intent: 'medical' },
  { query: 'nearest hospital', icon: '🚑', label: 'Hospital', intent: 'medical' },
  { query: 'How do I exit the stadium?', icon: '🚪', label: 'Exit Stadium', intent: 'exit' },
  { query: 'translate this sign for me', icon: '🗣️', label: 'Translate', intent: 'translation' },
] as const;

// ─── Demo Scenarios (per-language) ────────────────────────────────────────────
const DEMO_SCENARIOS: Record<string, Array<{ query: string; label: string; icon: string }>> = {
  ar: [
    { query: 'أحتاج طعام حلال قرب الملعب', label: 'Halal near stadium', icon: '🥙' },
    { query: 'أين أقرب مستشفى؟', label: 'Nearest hospital', icon: '🏥' },
    { query: 'أحتاج مواصلات إلى الفندق', label: 'Transport to hotel', icon: '🚗' },
  ],
  es: [
    { query: 'hospital más cercano con direcciones', label: 'Hospital + directions', icon: '🏥' },
    { query: 'comida mexicana cerca del estadio', label: 'Mexican food nearby', icon: '🌮' },
    { query: 'dónde puedo tomar el metro', label: 'Metro directions', icon: '🚇' },
  ],
  pt: [
    { query: 'vida noturna perto do estádio', label: 'Nightlife nearby', icon: '🌙' },
    { query: 'comida brasileira em Atlanta', label: 'Brazilian food', icon: '🍖' },
    { query: 'como chegar ao aeroporto', label: 'Airport directions', icon: '✈️' },
  ],
  fr: [
    { query: 'comment rentrer à mon hôtel en transport', label: 'Transport home', icon: '🚌' },
    { query: 'restaurant français près du stade', label: 'French restaurant', icon: '🥐' },
    { query: "où est l'entrée principale", label: 'Main entrance', icon: '🚪' },
  ],
  ja: [
    { query: 'スタジアム近くの日本食', label: 'Japanese food', icon: '🍱' },
    { query: '最寄りのトイレはどこ', label: 'Nearest restroom', icon: '🚻' },
  ],
  ko: [
    { query: '경기장 근처 한식당', label: 'Korean food', icon: '🍜' },
    { query: '호텔로 가는 교통편', label: 'Transport to hotel', icon: '🚗' },
  ],
};

export default function EventHomePage() {
  const { languageCode } = useGuestSession();
  const search = useConciergeStore((s) => s.search);
  const isLoading = useConciergeStore((s) => s.isLoading);
  const router = useRouter();
  const searchParams = useSearchParams();
  const VENUE_ID =
    searchParams.get('venueId') ??
    process.env.NEXT_PUBLIC_DEFAULT_VENUE_ID ??
    'mercedes-benz-stadium';
  const [freeText, setFreeText] = useState('');

  const demoScenarios = DEMO_SCENARIOS[languageCode] ?? [];

  async function handleChipClick(query: string) {
    await search(query, languageCode, VENUE_ID);
    router.push('/event/map');
  }

  async function handleFreeSearch() {
    if (!freeText.trim()) return;
    await search(freeText.trim(), languageCode, VENUE_ID);
    router.push('/event/map');
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Welcome banner */}
      <div className="mb-6 rounded-2xl bg-brand-gradient border border-brand-border p-6 shadow-brand">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          Wilkins Media · Atlanta 2026
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-brand-text">
          Welcome to Atlanta
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Your multilingual event companion is ready.
        </p>
      </div>

      {/* Free-text search */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleFreeSearch(); }}
              placeholder="Ask anything — food, directions, help…"
              className="w-full rounded-xl border border-brand-border bg-brand-surface pl-10 pr-4 py-3 text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-gold focus:outline-none transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={handleFreeSearch}
            disabled={isLoading || !freeText.trim()}
            className="shrink-0 rounded-xl bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-black transition-all hover:bg-brand-gold/90 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Intent chips — instant smart actions */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
        Quick Actions
      </p>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {INTENT_CHIPS.map((chip) => (
          <button
            key={chip.query}
            type="button"
            disabled={isLoading}
            onClick={() => handleChipClick(chip.query)}
            className="flex flex-col items-center gap-2 rounded-xl border border-brand-border bg-brand-surface p-3 text-center transition-all duration-200 hover:border-brand-gold/50 hover:shadow-brand hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
          >
            <span className="text-2xl transition-transform duration-200 group-hover:scale-110">{chip.icon}</span>
            <span className="text-xs font-medium text-brand-text leading-tight">{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Language-specific demo scenarios */}
      {demoScenarios.length > 0 && (
        <>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
            Try in your language
          </p>
          <div className="flex flex-col gap-2 mb-6">
            {demoScenarios.map((scenario) => (
              <button
                key={scenario.query}
                type="button"
                disabled={isLoading}
                onClick={() => handleChipClick(scenario.query)}
                className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface p-3 text-left transition-all hover:border-brand-electric/50 active:scale-[0.98] disabled:opacity-50"
              >
                <span className="text-xl">{scenario.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-text truncate">{scenario.label}</p>
                  <p className="text-xs text-brand-muted truncate" dir="auto">{scenario.query}</p>
                </div>
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-electric" />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Quick navigation grid */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
        Explore
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/event/map">
          <Card variant="elevated" className="cursor-pointer transition-all hover:border-brand-gold/50 hover:shadow-brand">
            <CardContent className="flex flex-col items-start gap-3 p-4">
              <MapPin className="h-6 w-6 text-brand-electric" />
              <span className="font-display text-sm font-semibold text-brand-text">Venue Map</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/event/translate">
          <Card variant="elevated" className="cursor-pointer transition-all hover:border-brand-gold/50 hover:shadow-brand">
            <CardContent className="flex flex-col items-start gap-3 p-4">
              <MessageSquare className="h-6 w-6 text-brand-gold" />
              <span className="font-display text-sm font-semibold text-brand-text">Live Translation</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/event/concierge">
          <Card variant="elevated" className="cursor-pointer transition-all hover:border-brand-gold/50 hover:shadow-brand">
            <CardContent className="flex flex-col items-start gap-3 p-4">
              <Utensils className="h-6 w-6 text-brand-success" />
              <span className="font-display text-sm font-semibold text-brand-text">Food & Culture</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/event/emergency">
          <Card variant="elevated" className="cursor-pointer transition-all hover:border-brand-emergency/50 border-brand-emergency/20">
            <CardContent className="flex flex-col items-start gap-3 p-4">
              <TriangleAlert className="h-6 w-6 text-brand-emergency" />
              <span className="font-display text-sm font-semibold text-brand-text">Emergency</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/event/rewards">
          <Card variant="elevated" className="cursor-pointer transition-all hover:border-fuchsia-500/50 border-fuchsia-500/20 bg-fuchsia-950/10">
            <CardContent className="flex flex-col items-start gap-3 p-4">
              <Trophy className="h-6 w-6 text-fuchsia-400" />
              <span className="font-display text-sm font-semibold text-brand-text">Rewards Passport</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Sponsored content — "Official Partner" card */}
      <div className="group relative rounded-xl border border-brand-gold/20 bg-gradient-to-br from-brand-surface via-brand-surface to-brand-gold/5 p-4 transition-all duration-300 hover:border-brand-gold/40 hover:shadow-lg hover:shadow-brand-gold/5">
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="gold" className="text-2xs">Official Partner</Badge>
        </div>
        <p className="text-sm font-medium text-brand-text group-hover:text-white transition-colors">
          Coca-Cola Fan Zone — Free experiences at Gate B
        </p>
        <p className="text-xs text-brand-muted mt-1">
          Discover exclusive refreshment stations near the stadium entrance.
        </p>
        <Link
          href="/event/map"
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-gold hover:text-brand-gold/80 transition-colors"
        >
          Show on map <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </div>
  );
}
