'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Star, Gift, Zap, Lock, Check, ChevronRight } from 'lucide-react';

// ─── Mock Data (mirrors seed badges + challenges) ───────────────────────

type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
type BadgeStatus = 'earned' | 'locked' | 'in_progress';

interface Badge {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  pointsValue: number;
  status: BadgeStatus;
  progress?: number; // 0–100
  requirement: string;
  earnedAt?: string;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: string;
  reward: string;
  progress: number;
  total: number;
  couponCode?: string;
}

interface Coupon {
  code: string;
  sponsor: string;
  value: string;
  expiresAt: string;
  redeemed: boolean;
}

const GUEST_POINTS = 285;

const BADGES: Badge[] = [
  { slug: 'welcome-explorer', name: 'Welcome Explorer', description: 'Begin your Atlanta journey', icon: '🌍', tier: 'BRONZE', pointsValue: 10, status: 'earned', requirement: 'Complete your first concierge search', earnedAt: 'Jun 14, 2026' },
  { slug: 'stadium-navigator', name: 'Stadium Navigator', description: 'Master the venue layout', icon: '🏟️', tier: 'BRONZE', pointsValue: 25, status: 'earned', requirement: 'Find 5 different venue POIs using the concierge', earnedAt: 'Jun 14, 2026' },
  { slug: 'transit-pro', name: 'Transit Pro', description: 'Navigate Atlanta like a local', icon: '🚇', tier: 'SILVER', pointsValue: 30, status: 'earned', requirement: 'Use MARTA directions 3 times', earnedAt: 'Jun 15, 2026' },
  { slug: 'coca-cola-superfan', name: 'Coca-Cola Superfan', description: 'Complete the Coca-Cola Fan Zone experience', icon: '🥤', tier: 'SILVER', pointsValue: 40, status: 'earned', requirement: 'Visit the Fan Zone and scan the QR code', earnedAt: 'Jun 16, 2026' },
  { slug: 'foodie-passport', name: 'Foodie Passport', description: 'Discover culturally relevant dining', icon: '🍽️', tier: 'SILVER', pointsValue: 50, status: 'in_progress', progress: 67, requirement: 'Visit 3 culturally-matched restaurants' },
  { slug: 'halftime-hustler', name: 'Halftime Hustler', description: 'Made the most of halftime', icon: '⚡', tier: 'BRONZE', pointsValue: 15, status: 'in_progress', progress: 33, requirement: 'Search for food, restroom, and merch during a single halftime window' },
  { slug: 'cultural-ambassador', name: 'Cultural Ambassador', description: 'Bridge cultures through language', icon: '🤝', tier: 'GOLD', pointsValue: 100, status: 'locked', requirement: 'Use translation bridge 5 times to help other guests' },
  { slug: 'emergency-hero', name: 'Emergency Hero', description: 'Helped someone in need', icon: '🦸', tier: 'GOLD', pointsValue: 75, status: 'locked', requirement: 'Assist in an emergency by providing translation or directions' },
  { slug: 'city-explorer', name: 'City Explorer', description: 'Explore Atlanta beyond the stadium', icon: '🗺️', tier: 'GOLD', pointsValue: 100, status: 'locked', requirement: 'Visit 3 different Atlanta neighborhoods via concierge' },
  { slug: 'adidas-quest-champion', name: 'Adidas Quest Champion', description: 'Complete the Adidas scavenger hunt', icon: '👟', tier: 'PLATINUM', pointsValue: 200, status: 'locked', requirement: 'Find all 5 Adidas checkpoints around the stadium district' },
];

const CHALLENGES: Challenge[] = [
  { id: '1', name: 'Coca-Cola Cultural Passport', description: 'Visit 3 culturally-matched food spots', type: 'Multi-Step', reward: '100 pts + Free Tour', progress: 2, total: 3, couponCode: 'COCACULTURE26' },
  { id: '2', name: 'Adidas Stadium Scavenger Hunt', description: 'Find 5 Adidas checkpoint QR codes', type: 'Scavenger Hunt', reward: '200 pts + Jersey', progress: 1, total: 5 },
  { id: '3', name: 'MARTA Explorer', description: 'Use MARTA directions 3 times', type: 'Visit', reward: '30 pts + Day Pass', progress: 3, total: 3, couponCode: 'MARTAFAN' },
  { id: '4', name: 'Translation Bridge Challenge', description: 'Help 5 guests with translation', type: 'Check-in', reward: '75 pts', progress: 0, total: 5 },
];

const COUPONS: Coupon[] = [
  { code: 'MARTAFAN', sponsor: 'MARTA', value: 'Free day pass', expiresAt: 'Jul 19, 2026', redeemed: false },
  { code: 'COCACULTURE26', sponsor: 'Coca-Cola', value: 'Free World of Coca-Cola admission', expiresAt: 'Jul 19, 2026', redeemed: false },
];

// ─── Helpers ────────────────────────────────────────────────────────────

const TIER_COLORS: Record<BadgeTier, { ring: string; bg: string; text: string }> = {
  BRONZE: { ring: 'ring-orange-600/50', bg: 'bg-orange-900/20', text: 'text-orange-400' },
  SILVER: { ring: 'ring-slate-400/50', bg: 'bg-slate-700/30', text: 'text-slate-300' },
  GOLD: { ring: 'ring-amber-500/50', bg: 'bg-amber-900/20', text: 'text-amber-400' },
  PLATINUM: { ring: 'ring-fuchsia-500/50', bg: 'bg-fuchsia-900/20', text: 'text-fuchsia-400' },
};

// ─── Component ──────────────────────────────────────────────────────────

type Tab = 'passport' | 'challenges' | 'wallet';

export default function RewardsPage() {
  const [tab, setTab] = useState<Tab>('passport');

  const earnedBadges = BADGES.filter((b) => b.status === 'earned');
  const inProgressBadges = BADGES.filter((b) => b.status === 'in_progress');
  const lockedBadges = BADGES.filter((b) => b.status === 'locked');

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-24">
      {/* ── Header ── */}
      <div className="bg-gradient-to-b from-fuchsia-950/40 to-slate-950 px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/event" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold font-display">My Passport</h1>
        </div>

        {/* Points summary */}
        <div className="flex items-center gap-4 bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
            <Star className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold">{GUEST_POINTS}</p>
            <p className="text-xs text-slate-400">Total Points Earned</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Trophy className="h-3 w-3 text-amber-400" />
              <span>{earnedBadges.length} badges</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Gift className="h-3 w-3 text-fuchsia-400" />
              <span>{COUPONS.filter((c) => !c.redeemed).length} coupons</span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Wallet optional: earn points, badges, and coupons instantly. Export later if you want collectibles.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mx-4 mb-4 p-1 bg-slate-900 rounded-xl">
        {([
          { key: 'passport' as Tab, label: 'Passport', icon: Trophy },
          { key: 'challenges' as Tab, label: 'Challenges', icon: Zap },
          { key: 'wallet' as Tab, label: 'Wallet', icon: Gift },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-fuchsia-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="px-4">
        {/* ── Passport Tab ── */}
        {tab === 'passport' && (
          <div className="space-y-6">
            {/* Earned */}
            {earnedBadges.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Earned ({earnedBadges.length})
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {earnedBadges.map((b) => {
                    const t = TIER_COLORS[b.tier];
                    return (
                      <div key={b.slug} className={`rounded-xl border border-slate-800 ${t.bg} p-4 ring-1 ${t.ring}`}>
                        <div className="text-3xl mb-2">{b.icon}</div>
                        <p className="text-sm font-semibold">{b.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{b.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs font-medium ${t.text}`}>{b.tier}</span>
                          <span className="text-xs text-amber-400 font-semibold">+{b.pointsValue} pts</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">{b.earnedAt}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* In Progress */}
            {inProgressBadges.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  In Progress ({inProgressBadges.length})
                </h2>
                <div className="space-y-3">
                  {inProgressBadges.map((b) => {
                    const t = TIER_COLORS[b.tier];
                    return (
                      <div key={b.slug} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{b.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{b.name}</p>
                            <p className="text-xs text-slate-400">{b.requirement}</p>
                          </div>
                          <span className={`text-xs font-medium ${t.text}`}>{b.tier}</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-400">{b.progress}%</span>
                            <span className="text-amber-400">+{b.pointsValue} pts</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-amber-400 transition-all"
                              style={{ width: `${b.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Locked */}
            {lockedBadges.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Locked ({lockedBadges.length})
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {lockedBadges.map((b) => {
                    const t = TIER_COLORS[b.tier];
                    return (
                      <div key={b.slug} className="rounded-xl border border-slate-800/50 bg-slate-900/50 p-4 opacity-60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl grayscale">{b.icon}</span>
                          <Lock className="h-3.5 w-3.5 text-slate-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-400">{b.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{b.requirement}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`text-xs font-medium ${t.text}`}>{b.tier}</span>
                          <span className="text-xs text-slate-500">+{b.pointsValue} pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── Challenges Tab ── */}
        {tab === 'challenges' && (
          <div className="space-y-3">
            {CHALLENGES.map((ch) => {
              const pct = Math.round((ch.progress / ch.total) * 100);
              const isComplete = ch.progress >= ch.total;
              return (
                <div key={ch.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold">{ch.name}</p>
                      <p className="text-xs text-slate-400">{ch.description}</p>
                    </div>
                    {isComplete ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{ch.progress}/{ch.total}</p>
                        <p className="text-[10px] text-slate-500">{ch.type}</p>
                      </div>
                    )}
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isComplete
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-fuchsia-500 to-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{ch.reward}</span>
                    {isComplete && ch.couponCode && (
                      <span className="text-green-400 font-medium">Coupon unlocked!</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Wallet Tab ── */}
        {tab === 'wallet' && (
          <div className="space-y-4">
            {/* Points Balance */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-900/10 p-5 text-center">
              <p className="text-xs text-amber-400 uppercase tracking-wide mb-1">Points Balance</p>
              <p className="text-4xl font-bold text-amber-400">{GUEST_POINTS}</p>
              <p className="text-xs text-slate-400 mt-1">Earn more by completing challenges and scanning QR codes</p>
            </div>

            {/* Coupons */}
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              My Coupons ({COUPONS.length})
            </h2>
            {COUPONS.map((c) => (
              <div key={c.code} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{c.value}</p>
                    <p className="text-xs text-slate-500">{c.sponsor} · Expires {c.expiresAt}</p>
                  </div>
                  <button className="flex items-center gap-1 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 px-3 py-1.5 text-xs font-medium transition-colors">
                    Redeem
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <code className="bg-slate-800 rounded px-2 py-0.5 text-xs text-amber-400 font-mono">{c.code}</code>
                  {c.redeemed && (
                    <span className="text-xs text-green-400 font-medium">Redeemed</span>
                  )}
                </div>
              </div>
            ))}

            {/* Digital Passport Export */}
            <div className="rounded-xl border border-dashed border-slate-700 p-5 text-center">
              <p className="text-sm text-slate-400 mb-2">Export your digital passport</p>
              <button className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-sm font-medium transition-colors">
                Add to Apple Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
