'use client';

import Link from 'next/link';
import { ArrowLeft, Trophy, Star, Gift, Lock, Check, ChevronRight, Sparkles, Ticket } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
type Status = 'earned' | 'in_progress' | 'locked';

interface Badge {
  slug: string;
  name: string;
  icon: string;
  tier: Tier;
  points: number;
  status: Status;
  progress?: number;
  requirement: string;
}

const TOTAL_POINTS = 285;

const BADGES: Badge[] = [
  { slug: 'welcome-explorer', name: 'Welcome Explorer', icon: '🌍', tier: 'BRONZE', points: 10, status: 'earned', requirement: 'Complete your first search' },
  { slug: 'stadium-navigator', name: 'Stadium Navigator', icon: '🏟️', tier: 'BRONZE', points: 25, status: 'earned', requirement: 'Find 5 venue locations' },
  { slug: 'transit-pro', name: 'Transit Pro', icon: '🚇', tier: 'SILVER', points: 30, status: 'earned', requirement: 'Use MARTA directions 3 times' },
  { slug: 'coca-cola-superfan', name: 'Coca-Cola Superfan', icon: '🥤', tier: 'SILVER', points: 40, status: 'earned', requirement: 'Visit Coca-Cola Fan Zone' },
  { slug: 'foodie-passport', name: 'Foodie Passport', icon: '🍽️', tier: 'SILVER', points: 50, status: 'in_progress', progress: 67, requirement: 'Visit 3 culturally-matched restaurants' },
  { slug: 'cultural-ambassador', name: 'Cultural Ambassador', icon: '🤝', tier: 'GOLD', points: 100, status: 'locked', requirement: 'Use translation bridge 5 times' },
  { slug: 'adidas-quest', name: 'Adidas Quest Champion', icon: '👟', tier: 'PLATINUM', points: 200, status: 'locked', requirement: 'Find all 5 Adidas QR checkpoints' },
];

interface Reward {
  id: string;
  sponsor: string;
  offer: string;
  code: string;
  icon: string;
  redeemed: boolean;
}

const REWARDS: Reward[] = [
  { id: '1', sponsor: 'MARTA', offer: 'Free MARTA Day Pass', code: 'MARTAFAN', icon: '🚇', redeemed: false },
  { id: '2', sponsor: 'Coca-Cola', offer: 'Free World of Coca-Cola admission', code: 'COCACULTURE26', icon: '🥤', redeemed: false },
  { id: '3', sponsor: 'Adidas', offer: '20% off at Adidas Fan Shop', code: 'ADIFIFA26', icon: '👟', redeemed: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIER_STYLE: Record<Tier, { ring: string; bg: string; text: string }> = {
  BRONZE: { ring: 'ring-orange-600/50', bg: 'bg-orange-900/20', text: 'text-orange-400' },
  SILVER: { ring: 'ring-slate-400/50', bg: 'bg-slate-700/30', text: 'text-slate-300' },
  GOLD: { ring: 'ring-amber-500/50', bg: 'bg-amber-900/20', text: 'text-amber-400' },
  PLATINUM: { ring: 'ring-fuchsia-500/50', bg: 'bg-fuchsia-900/20', text: 'text-fuchsia-400' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function RewardsPage() {
  const earnedCount = BADGES.filter((b) => b.status === 'earned').length;

  return (
    <div className="mx-auto max-w-lg px-4 py-6 animate-fade-in">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="mb-6">
        <Link href="/tap" className="mb-3 inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-text transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
        <h1 className="font-display text-2xl font-black text-white">
          <Trophy className="mr-2 inline h-6 w-6 text-brand-gold" />
          Rewards Passport
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Explore Atlanta, earn badges, unlock rewards
        </p>
      </div>

      {/* ── Points Banner ─────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-brand-gold/30 bg-gradient-to-br from-brand-gold/10 to-brand-surface p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold">Your Points</p>
        <p className="mt-1 font-display text-4xl font-black text-white">{TOTAL_POINTS}</p>
        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-brand-muted">
          <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
          <span>{earnedCount}/{BADGES.length} badges earned</span>
        </div>
      </div>

      {/* ── Badge Grid ────────────────────────────────────── */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
        Badges
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {BADGES.map((badge) => {
          const style = TIER_STYLE[badge.tier];
          return (
            <div
              key={badge.slug}
              className={`relative rounded-2xl border border-brand-border p-3 transition-all ${
                badge.status === 'locked' ? 'opacity-50' : ''
              } ${badge.status === 'earned' ? `ring-1 ${style.ring}` : ''}`}
            >
              {/* Status indicator */}
              <div className="absolute top-2 right-2">
                {badge.status === 'earned' && <Check className="h-4 w-4 text-brand-success" />}
                {badge.status === 'locked' && <Lock className="h-4 w-4 text-brand-muted" />}
              </div>

              <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${style.bg}`}>
                {badge.icon}
              </div>
              <p className="text-xs font-bold text-white leading-tight">{badge.name}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`text-2xs font-semibold ${style.text}`}>{badge.tier}</span>
                <span className="text-2xs text-brand-muted">· {badge.points} pts</span>
              </div>

              {/* Progress bar */}
              {badge.status === 'in_progress' && badge.progress != null && (
                <div className="mt-2">
                  <div className="h-1 w-full rounded-full bg-brand-navy">
                    <div
                      className="h-1 rounded-full bg-brand-gold transition-all"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  <p className="mt-0.5 text-2xs text-brand-muted">{badge.progress}%</p>
                </div>
              )}

              <p className="mt-1 text-2xs text-brand-muted/70 leading-snug">{badge.requirement}</p>
            </div>
          );
        })}
      </div>

      {/* ── Unlocked Rewards ──────────────────────────────── */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
        Your Rewards
      </p>

      <div className="flex flex-col gap-2 mb-6">
        {REWARDS.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-3 rounded-xl border border-brand-gold/20 bg-gradient-to-r from-brand-gold/5 to-brand-surface p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-xl">
              {r.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{r.offer}</p>
              <p className="text-2xs text-brand-muted">by {r.sponsor}</p>
            </div>
            <div className="shrink-0 rounded-lg bg-brand-gold/10 px-2.5 py-1.5">
              <p className="font-mono text-2xs font-bold text-brand-gold">{r.code}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sponsor CTA ───────────────────────────────────── */}
      <div className="rounded-2xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-950/20 to-brand-surface p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-900/30 text-xl">
            👟
          </div>
          <div>
            <span className="text-2xs font-bold uppercase tracking-widest text-fuchsia-400">
              Adidas Challenge
            </span>
            <p className="mt-1 text-sm font-semibold text-white">
              Find 5 Adidas QR checkpoints around the stadium
            </p>
            <p className="mt-1 text-xs text-brand-muted">
              Win a signed jersey + 200 points
            </p>
          </div>
        </div>
      </div>

      {/* ── What's Next ───────────────────────────────────── */}
      <div className="mt-6 rounded-2xl border border-brand-electric/30 bg-gradient-to-br from-blue-600/10 to-brand-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-electric mb-2">
          What&#39;s next?
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/tap/food" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
            <span className="text-sm text-brand-text">🍽️ Visit a restaurant and earn Foodie Passport</span>
            <ChevronRight className="h-4 w-4 text-brand-muted" />
          </Link>
          <Link href="/tap/directions" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
            <span className="text-sm text-brand-text">🏟️ Navigate to the stadium</span>
            <ChevronRight className="h-4 w-4 text-brand-muted" />
          </Link>
        </div>
      </div>
    </div>
  );
}
