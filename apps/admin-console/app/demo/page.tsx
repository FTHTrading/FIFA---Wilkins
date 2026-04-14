'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Play, Copy, Check, RotateCcw, Globe, Users, Zap, Eye,
  ArrowLeft, ChevronRight, Sparkles,
} from 'lucide-react';

// ─── Demo Scenarios (mirrors seed-atlanta.ts guest sessions) ──────────────────

interface Scenario {
  sessionId: string;
  lang: string;
  flag: string;
  langLabel: string;
  persona: string;
  role: string;
  description: string;
  intents: string[];
  culturalNotes: string;
  color: string;
  accentBg: string;
  accentText: string;
}

const SCENARIOS: Scenario[] = [
  {
    sessionId: 'demo-arabic-family-01',
    lang: 'ar',
    flag: '🇸🇦',
    langLabel: 'Arabic',
    persona: 'Khalid Al-Rashidi',
    role: 'Family Traveler — Saudi Arabia',
    description: 'Traveling with wife and three children. Needs halal food, prayer room schedule, family-friendly seating, and medical assistance for child with allergy.',
    intents: ['halal-food', 'prayer-room', 'family-zone', 'medical'],
    culturalNotes: 'RTL layout active, prayer time awareness, gender-neutral facility requests, family priority queuing',
    color: 'border-emerald-500/40',
    accentBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-400',
  },
  {
    sessionId: 'demo-spanish-group-01',
    lang: 'es',
    flag: '🇲🇽',
    langLabel: 'Spanish',
    persona: 'Carlos Mendoza',
    role: 'Fan Group Leader — Mexico',
    description: 'Organizing 12-person Mexican supporter group. Needs transit from hotel, group seating, and fan zone activations. Big Coca-Cola & Adidas fan.',
    intents: ['transit', 'group-seating', 'fan-zone', 'food-cultural'],
    culturalNotes: 'Group coordination mode, sponsor affinity (Coca-Cola highest), post-match nightlife queries expected',
    color: 'border-red-500/40',
    accentBg: 'bg-red-500/10',
    accentText: 'text-red-400',
  },
  {
    sessionId: 'demo-portuguese-corporate-01',
    lang: 'pt',
    flag: '🇧🇷',
    langLabel: 'Portuguese',
    persona: 'Ana Lima',
    role: 'Corporate Traveler — Brazil',
    description: 'Business class traveling with Hyatt upgrade package. Expects premium hospitality, VIP lounge access, and Delta Sky upgrade. High spend intent.',
    intents: ['premium-hospitality', 'vip-lounge', 'transport', 'hotel'],
    culturalNotes: 'Premium tier triggers Hyatt/Delta campaigns first, formal language register, expense-account spend pattern',
    color: 'border-amber-500/40',
    accentBg: 'bg-amber-500/10',
    accentText: 'text-amber-400',
  },
  {
    sessionId: 'demo-french-tourist-01',
    lang: 'fr',
    flag: '🇫🇷',
    langLabel: 'French',
    persona: 'Jean-Pierre Martin',
    role: 'Cultural Tourist — France',
    description: 'First-time visitor to Atlanta. Wants museum recommendations, historic neighborhoods, local cuisine. Uses concierge heavily for city exploration.',
    intents: ['city-exploration', 'museums', 'local-dining', 'transit'],
    culturalNotes: 'High RAG query volume, cultural POI emphasis, Discover Atlanta campaign affinity, neighborhood explorer badge path',
    color: 'border-blue-500/40',
    accentBg: 'bg-blue-500/10',
    accentText: 'text-blue-400',
  },
  {
    sessionId: 'demo-japanese-solo-01',
    lang: 'ja',
    flag: '🇯🇵',
    langLabel: 'Japanese',
    persona: 'Yuki Tanaka',
    role: 'Solo Traveler — Japan',
    description: 'Solo female traveler, highly tech-savvy. Completing the Coca-Cola Cultural Passport challenge. Using QR scans and translation bridge heavily.',
    intents: ['food-cultural', 'translation', 'qr-scan', 'challenge-progress'],
    culturalNotes: 'Translation bridge active, female solo safety routing, Coca-Cola Cultural Passport challenge in progress (2/3)',
    color: 'border-pink-500/40',
    accentBg: 'bg-pink-500/10',
    accentText: 'text-pink-400',
  },
  {
    sessionId: 'demo-korean-group-01',
    lang: 'ko',
    flag: '🇰🇷',
    langLabel: 'Korean',
    persona: 'Ji-Young Park',
    role: 'K-Culture Fan — South Korea',
    description: 'Attending with K-drama fan club. Heavy social sharing, food hall discovery, and badge collection. High engagement with Reward Engine campaigns.',
    intents: ['korean-food', 'reward-badges', 'social-share', 'stadium-navigation'],
    culturalNotes: 'Reward engine affinity highest, badge collection motivation, K-cuisine POI surfacing, group selfie spot routing',
    color: 'border-violet-500/40',
    accentBg: 'bg-violet-500/10',
    accentText: 'text-violet-400',
  },
];

const WEB_BASE = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000';

// ─── Component ───────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const buildDemoUrl = (s: Scenario) =>
    `${WEB_BASE}?demo=1&session=${s.sessionId}&lang=${s.lang}`;

  const activateScenario = (s: Scenario) => {
    setActiveScenario(s.sessionId);
    // Store in localStorage so the web app can pick it up
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('wilkins_demo_session', s.sessionId);
      localStorage.setItem('wilkins_demo_lang', s.lang);
    }
  };

  const copyUrl = (s: Scenario) => {
    navigator.clipboard.writeText(buildDemoUrl(s)).then(() => {
      setCopiedId(s.sessionId);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {});
  };

  const resetDemo = () => {
    setActiveScenario(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('wilkins_demo_session');
      localStorage.removeItem('wilkins_demo_lang');
    }
  };

  const active = SCENARIOS.find((s) => s.sessionId === activeScenario) ?? null;

  return (
    <main className="min-h-screen bg-brand-black text-white p-6">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-border hover:bg-brand-border/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fuchsia-400" />
              Demo Mode Controller
            </h1>
            <p className="text-brand-muted text-sm mt-0.5">
              6 multilingual guest personas · FIFA World Cup 2026 Atlanta
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-brand-muted cursor-pointer select-none">
            <div
              onClick={() => setAutoPlay((v) => !v)}
              className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${
                autoPlay ? 'bg-brand-gold' : 'bg-brand-border'
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  autoPlay ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            Auto-play
          </label>
          <button
            type="button"
            onClick={resetDemo}
            className="flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-muted hover:bg-brand-border transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </header>

      {/* Active Session Banner */}
      {active && (
        <div className="mb-6 rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{active.flag}</span>
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Active Demo: {active.persona}
                </p>
                <p className="text-xs text-fuchsia-300 font-mono">{active.sessionId}</p>
              </div>
            </div>
            <a
              href={buildDemoUrl(active)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 px-3 py-1.5 text-xs font-medium transition-colors"
            >
              <Eye className="h-3 w-3" />
              Open Guest View
              <ChevronRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {SCENARIOS.map((s) => {
          const isActive = activeScenario === s.sessionId;
          const isCopied = copiedId === s.sessionId;

          return (
            <div
              key={s.sessionId}
              className={`rounded-xl border ${s.color} bg-brand-surface p-5 transition-all ${
                isActive ? 'ring-1 ring-brand-gold/50 bg-brand-surface/80' : ''
              }`}
            >
              {/* Persona header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-2xl ${s.accentBg}`}>
                    {s.flag}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{s.persona}</p>
                    <p className={`text-xs ${s.accentText}`}>{s.langLabel} · {s.lang}</p>
                  </div>
                </div>
                {isActive && (
                  <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                )}
              </div>

              {/* Role */}
              <p className="text-xs text-brand-muted/70 mb-2">{s.role}</p>

              {/* Description */}
              <p className="text-xs text-brand-text mb-3 leading-relaxed">{s.description}</p>

              {/* Intents */}
              <div className="flex flex-wrap gap-1 mb-3">
                {s.intents.map((intent) => (
                  <span
                    key={intent}
                    className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-medium ${s.accentBg} ${s.accentText}`}
                  >
                    {intent}
                  </span>
                ))}
              </div>

              {/* Cultural notes */}
              <p className="text-[10px] text-brand-muted/70 italic mb-4">{s.culturalNotes}</p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => activateScenario(s)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="h-3 w-3" />
                      Activated
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      Activate
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => copyUrl(s)}
                  title="Copy direct demo URL"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border bg-brand-border hover:bg-brand-border/80 transition-colors"
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-brand-muted" />
                  )}
                </button>

                <a
                  href={buildDemoUrl(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open guest view"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border bg-brand-border hover:bg-brand-border/80 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-brand-muted" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <section className="mt-8 rounded-xl border border-brand-border bg-brand-surface p-5">
        <h2 className="text-sm font-semibold text-brand-text mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          How Demo Mode Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-brand-muted">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold shrink-0">1</span>
            <div>
              <p className="font-medium text-brand-text mb-0.5">Activate a Persona</p>
              <p>Sets <code className="bg-brand-border px-1 rounded text-amber-300">wilkins_demo_session</code> in localStorage so the guest web app loads that persona&apos;s state.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold shrink-0">2</span>
            <div>
              <p className="font-medium text-brand-text mb-0.5">Open Guest View</p>
              <p>Opens <code className="bg-brand-border px-1 rounded text-amber-300">localhost:3000?demo=1</code> pre-configured with that session ID, language, and event context.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold shrink-0">3</span>
            <div>
              <p className="font-medium text-brand-text mb-0.5">Share Direct URL</p>
              <p>Use <code className="bg-brand-border px-1 rounded text-amber-300">Copy URL</code> to share a deep link with partners — includes session + language params for instant demo launch.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
