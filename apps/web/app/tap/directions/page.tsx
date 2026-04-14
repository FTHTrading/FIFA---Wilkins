'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Navigation,
  MapPin,
  Clock,
  ChevronRight,
  Train,
  Car,
  Footprints,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Locate,
} from 'lucide-react';

// ─── Route Steps ──────────────────────────────────────────────────────────────

interface RouteStep {
  id: number;
  icon: string;
  instruction: string;
  detail: string;
  distance: string;
  highlight?: boolean;
}

const WALKING_ROUTE: RouteStep[] = [
  { id: 1, icon: '📍', instruction: 'Start at MARTA Five Points Station', detail: 'Exit via Peachtree St entrance (west side)', distance: '' },
  { id: 2, icon: '🚶', instruction: 'Walk south on Martin Luther King Jr Dr', detail: 'Follow the FIFA wayfinding signs (gold arrows)', distance: '0.3 mi' },
  { id: 3, icon: '🏟️', instruction: 'Turn right toward Mercedes-Benz Stadium', detail: 'Stadium complex entrance visible ahead', distance: '0.2 mi' },
  { id: 4, icon: '🚪', instruction: 'Enter via Gate C – East Plaza', detail: 'Nearest entry for your section. Bag check required.', distance: '0.1 mi', highlight: true },
  { id: 5, icon: '📱', instruction: 'Show your mobile ticket at scanner', detail: 'Section 121, Row 14, Seats 5-6', distance: '' },
];

const TRANSIT_OPTIONS = [
  { mode: 'MARTA Rail', icon: Train, time: '12 min', cost: '$2.50', note: 'Five Points → Dome/GWCC/CNN Center' },
  { mode: 'Rideshare', icon: Car, time: '8 min', cost: '$12–18', note: 'Drop-off at Lot C, Martin Luther King Jr Dr' },
  { mode: 'Walk', icon: Footprints, time: '22 min', cost: 'Free', note: 'From Centennial Olympic Park' },
];

// ─── Nearby POI suggestions ──────────────────────────────────────────────────

const NEARBY_POIS = [
  { emoji: '🚻', label: 'Restrooms', detail: 'Level 1 near Gate C', distance: '1 min walk' },
  { emoji: '🍔', label: 'Concessions', detail: 'Section 120-122 concourse', distance: '2 min walk' },
  { emoji: '🏥', label: 'First Aid', detail: 'Level 1 near Guest Services', distance: '3 min walk' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DirectionsPage() {
  const [showTransit, setShowTransit] = useState(false);

  return (
    <div className="mx-auto max-w-lg px-4 py-6 animate-fade-in">
      {/* ── Back + Title ──────────────────────────────────── */}
      <div className="mb-6">
        <Link href="/tap" className="mb-3 inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-text transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <h1 className="font-display text-2xl font-black text-white">
          <Navigation className="mr-2 inline h-6 w-6 text-blue-400" />
          Directions
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Mercedes-Benz Stadium · Gate C
        </p>
      </div>

      {/* ── Map Visual (static demo) ──────────────────────── */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-brand-border bg-brand-surface">
        <div className="relative h-52 bg-gradient-to-br from-brand-navy via-brand-slate to-brand-surface flex items-center justify-center">
          {/* Mock map with route line */}
          <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full p-4" aria-label="Route from Five Points to Mercedes-Benz Stadium">
            {/* Grid dots */}
            {Array.from({ length: 8 }).map((_, r) =>
              Array.from({ length: 16 }).map((_, c) => (
                <circle key={`${r}-${c}`} cx={25 * c + 12} cy={25 * r + 12} r="1" fill="#243050" />
              )),
            )}
            {/* Route path */}
            <path
              d="M 80 40 L 80 100 L 200 100 L 200 140 L 320 140"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray="8 4"
              strokeLinecap="round"
            />
            {/* Start */}
            <circle cx="80" cy="40" r="8" fill="#3B82F6" />
            <text x="80" y="30" textAnchor="middle" fill="#E8EEFF" fontSize="10" fontWeight="bold">MARTA</text>
            {/* End */}
            <circle cx="320" cy="140" r="10" fill="#C9A84C" />
            <circle cx="320" cy="140" r="6" fill="#0A0A0F" />
            <circle cx="320" cy="140" r="3" fill="#C9A84C" />
            <text x="320" y="165" textAnchor="middle" fill="#C9A84C" fontSize="10" fontWeight="bold">STADIUM</text>
            {/* Midpoint marker */}
            <circle cx="200" cy="100" r="4" fill="#22C55E" />
          </svg>

          {/* ETA badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-brand-black/80 px-2.5 py-1.5 backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5 text-brand-gold" />
            <span className="text-xs font-bold text-white">22 min walk</span>
          </div>

          {/* Distance badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-brand-black/80 px-2.5 py-1.5 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-brand-muted">0.6 mi</span>
          </div>
        </div>
      </div>

      {/* ── Transit Options Toggle ────────────────────────── */}
      <button
        type="button"
        onClick={() => setShowTransit(!showTransit)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-brand-border bg-brand-surface p-3 text-left transition-all hover:border-brand-electric/50"
      >
        <div className="flex items-center gap-2">
          <Train className="h-4 w-4 text-brand-electric" />
          <span className="text-sm font-semibold text-white">Transit Options</span>
        </div>
        {showTransit ? (
          <ChevronUp className="h-4 w-4 text-brand-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 text-brand-muted" />
        )}
      </button>

      {showTransit && (
        <div className="mb-6 flex flex-col gap-2 animate-slide-up">
          {TRANSIT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.mode}
                className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy">
                  <Icon className="h-4.5 w-4.5 text-brand-electric" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{opt.mode}</span>
                    <span className="text-xs font-bold text-brand-gold">{opt.time}</span>
                  </div>
                  <p className="text-2xs text-brand-muted truncate">{opt.note}</p>
                </div>
                <span className="text-xs text-brand-muted">{opt.cost}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Walking Route Steps ───────────────────────────── */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
        Step-by-step route
      </p>

      <div className="relative mb-6">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-6 bottom-6 w-px bg-brand-border" />

        <div className="flex flex-col gap-3">
          {WALKING_ROUTE.map((step, i) => (
            <div
              key={step.id}
              className={`relative flex items-start gap-4 rounded-xl border p-3 transition-all ${
                step.highlight
                  ? 'border-brand-gold/40 bg-brand-gold/5 shadow-brand'
                  : 'border-brand-border bg-brand-surface'
              }`}
            >
              {/* Step circle */}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                  step.highlight
                    ? 'bg-brand-gold/20 ring-2 ring-brand-gold/50'
                    : 'bg-brand-navy'
                }`}
              >
                {step.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-tight ${step.highlight ? 'text-brand-gold' : 'text-white'}`}>
                  {step.instruction}
                </p>
                <p className="mt-0.5 text-2xs text-brand-muted">{step.detail}</p>
              </div>

              {step.distance && (
                <span className="shrink-0 text-2xs font-mono text-brand-muted">{step.distance}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Nearby When You Arrive ────────────────────────── */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
        Near your gate
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {NEARBY_POIS.map((poi) => (
          <div
            key={poi.label}
            className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface p-3"
          >
            <span className="text-xl">{poi.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{poi.label}</p>
              <p className="text-2xs text-brand-muted">{poi.detail}</p>
            </div>
            <span className="text-2xs text-brand-muted">{poi.distance}</span>
          </div>
        ))}
      </div>

      {/* ── What's Next prompt ────────────────────────────── */}
      <div className="rounded-2xl border border-brand-electric/30 bg-gradient-to-br from-blue-600/10 to-brand-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-electric mb-2">
          What&#39;s next?
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/tap/food" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
            <span className="text-sm text-brand-text">🍽️ Find food near your seat</span>
            <ChevronRight className="h-4 w-4 text-brand-muted" />
          </Link>
          <Link href="/tap/rewards" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
            <span className="text-sm text-brand-text">🏆 Check your rewards passport</span>
            <ChevronRight className="h-4 w-4 text-brand-muted" />
          </Link>
          <Link href="/tap/help" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
            <span className="text-sm text-brand-text">🆘 Emergency &amp; safety info</span>
            <ChevronRight className="h-4 w-4 text-brand-muted" />
          </Link>
        </div>
      </div>
    </div>
  );
}
