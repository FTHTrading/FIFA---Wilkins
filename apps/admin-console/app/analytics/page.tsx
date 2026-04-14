'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign, TrendingUp, Globe, Zap, MapPin, Clock,
  BarChart3, Users, ArrowUp, ArrowDown, Activity,
} from 'lucide-react';

// ─── Revenue Simulation Engine ──────────────────────────────────────────────
// Deterministic base data + real-time tick that adds small deltas every second

interface RevenueByLanguage {
  code: string;
  name: string;
  flag: string;
  revenue: number;
  impressions: number;
  clicks: number;
  sessions: number;
}

interface RevenueByIntent {
  intent: string;
  label: string;
  icon: string;
  revenue: number;
  impressions: number;
  conversions: number;
}

interface RevenueByZone {
  zone: string;
  label: string;
  revenue: number;
  impressions: number;
  conversions: number;
}

interface CampaignRevenue {
  id: string;
  name: string;
  sponsor: string;
  tier: 'SMART_PLACEMENT' | 'CULTURAL_CONCIERGE' | 'REWARD_ENGINE';
  revenue: number;
  impressions: number;
  clicks: number;
  couponsRedeemed: number;
  roas: number;
}

// Base data — realistic for a multi-week FIFA event
const BASE_LANGUAGE_REVENUE: RevenueByLanguage[] = [
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', revenue: 24_850, impressions: 42_310, clicks: 5_678, sessions: 3_412 },
  { code: 'es', name: 'Spanish', flag: '🇲🇽', revenue: 21_400, impressions: 38_900, clicks: 4_891, sessions: 2_891 },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', revenue: 14_300, impressions: 22_560, clicks: 3_156, sessions: 1_756 },
  { code: 'fr', name: 'French', flag: '🇫🇷', revenue: 9_800, impressions: 14_230, clicks: 1_923, sessions: 1_123 },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', revenue: 11_200, impressions: 12_870, clicks: 2_287, sessions: 987 },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', revenue: 8_950, impressions: 10_340, clicks: 1_634, sessions: 834 },
  { code: 'en', name: 'English', flag: '🇺🇸', revenue: 18_600, impressions: 28_900, clicks: 3_517, sessions: 1_217 },
  { code: 'de', name: 'German', flag: '🇩🇪', revenue: 6_200, impressions: 7_890, clicks: 912, sessions: 534 },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', revenue: 7_800, impressions: 9_450, clicks: 1_087, sessions: 612 },
];

const BASE_INTENT_REVENUE: RevenueByIntent[] = [
  { intent: 'food-cultural', label: 'Food & Dining', icon: '🍽️', revenue: 38_400, impressions: 48_210, conversions: 6_214 },
  { intent: 'transport', label: 'Transportation', icon: '🚗', revenue: 22_100, impressions: 31_890, conversions: 4_391 },
  { intent: 'restroom', label: 'Restrooms', icon: '🚻', revenue: 8_200, impressions: 28_740, conversions: 1_874 },
  { intent: 'medical', label: 'Medical / Emergency', icon: '🏥', revenue: 4_100, impressions: 8_312, conversions: 612 },
  { intent: 'translation', label: 'Translation', icon: '🗣️', revenue: 12_800, impressions: 16_780, conversions: 2_478 },
  { intent: 'exit', label: 'Stadium Exit', icon: '🚪', revenue: 18_600, impressions: 24_390, conversions: 3_891 },
  { intent: 'hospitality', label: 'Hospitality / Hotel', icon: '🏨', revenue: 15_200, impressions: 14_560, conversions: 1_812 },
  { intent: 'family_support', label: 'Family Support', icon: '👨‍👩‍👧', revenue: 3_700, impressions: 5_230, conversions: 423 },
];

const BASE_ZONE_REVENUE: RevenueByZone[] = [
  { zone: 'stadium-interior', label: 'Stadium Interior', revenue: 42_800, impressions: 68_400, conversions: 8_912 },
  { zone: 'gate-district', label: 'Gate District (500m)', revenue: 28_600, impressions: 41_200, conversions: 5_634 },
  { zone: 'centennial-park', label: 'Centennial Olympic Park', revenue: 18_200, impressions: 24_890, conversions: 3_112 },
  { zone: 'downtown-atlanta', label: 'Downtown Atlanta', revenue: 22_400, impressions: 31_560, conversions: 4_087 },
  { zone: 'airport-zone', label: 'Airport / Transit Hub', revenue: 11_100, impressions: 12_060, conversions: 1_851 },
];

const BASE_CAMPAIGN_REVENUE: CampaignRevenue[] = [
  { id: '1', name: 'Coca-Cola Fan Zone Promotion', sponsor: 'Coca-Cola', tier: 'SMART_PLACEMENT', revenue: 12_450, impressions: 14_832, clicks: 1_247, couponsRedeemed: 312, roas: 5.1 },
  { id: '2', name: 'MARTA Transit Pass', sponsor: 'MARTA', tier: 'SMART_PLACEMENT', revenue: 8_200, impressions: 11_205, clicks: 891, couponsRedeemed: 187, roas: 4.6 },
  { id: '3', name: 'CVS Pharmacy Essentials', sponsor: 'CVS', tier: 'SMART_PLACEMENT', revenue: 3_680, impressions: 4_210, clicks: 387, couponsRedeemed: 89, roas: 5.4 },
  { id: '4', name: 'Verizon Fan Connectivity', sponsor: 'Verizon', tier: 'SMART_PLACEMENT', revenue: 9_100, impressions: 18_900, clicks: 1_523, couponsRedeemed: 0, roas: 2.9 },
  { id: '5', name: 'Chick-fil-A Halal Menu', sponsor: 'Chick-fil-A', tier: 'CULTURAL_CONCIERGE', revenue: 18_200, impressions: 6_314, clicks: 892, couponsRedeemed: 534, roas: 4.3 },
  { id: '6', name: 'Delta Sky Lounge', sponsor: 'Delta Air Lines', tier: 'CULTURAL_CONCIERGE', revenue: 22_800, impressions: 9_621, clicks: 743, couponsRedeemed: 412, roas: 3.9 },
  { id: '7', name: 'Uber Post-Match Pickup', sponsor: 'Uber', tier: 'CULTURAL_CONCIERGE', revenue: 31_200, impressions: 22_100, clicks: 3_891, couponsRedeemed: 0, roas: 3.8 },
  { id: '8', name: 'Hyatt Guest Welcome', sponsor: 'Hyatt', tier: 'CULTURAL_CONCIERGE', revenue: 14_500, impressions: 8_740, clicks: 612, couponsRedeemed: 256, roas: 3.2 },
  { id: '9', name: 'Adidas Scavenger Hunt', sponsor: 'Adidas', tier: 'REWARD_ENGINE', revenue: 28_000, impressions: 7_850, clicks: 1_045, couponsRedeemed: 623, roas: 1.9 },
  { id: '10', name: 'Coca-Cola Cultural Passport', sponsor: 'Coca-Cola', tier: 'REWARD_ENGINE', revenue: 24_000, impressions: 5_410, clicks: 934, couponsRedeemed: 445, roas: 2.0 },
  { id: '11', name: 'Discover Atlanta Badge', sponsor: 'Discover Atlanta', tier: 'REWARD_ENGINE', revenue: 16_500, impressions: 4_320, clicks: 578, couponsRedeemed: 312, roas: 1.9 },
  { id: '12', name: 'Mercedes-Benz VIP Upgrade', sponsor: 'Mercedes-Benz', tier: 'REWARD_ENGINE', revenue: 34_000, impressions: 3_180, clicks: 412, couponsRedeemed: 87, roas: 1.5 },
];

const TIER_COLORS = {
  SMART_PLACEMENT: { text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  CULTURAL_CONCIERGE: { text: 'text-amber-400', bg: 'bg-amber-500/10' },
  REWARD_ENGINE: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
} as const;

const TIER_LABELS = {
  SMART_PLACEMENT: 'Smart Placement',
  CULTURAL_CONCIERGE: 'Cultural Concierge',
  REWARD_ENGINE: 'Reward Engine',
} as const;

// ─── Simulation Hook ────────────────────────────────────────────────────────

function useRevenueSimulation() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  // Small deterministic delta per tick
  const delta = useCallback((base: number, seed: number) => {
    const pct = 0.001 + ((seed * 7 + tick * 13) % 17) / 17000;
    return Math.round(base * pct * tick);
  }, [tick]);

  const languages = BASE_LANGUAGE_REVENUE.map((l, i) => ({
    ...l,
    revenue: l.revenue + delta(l.revenue, i),
    impressions: l.impressions + delta(l.impressions, i + 10),
    clicks: l.clicks + delta(l.clicks, i + 20),
  }));

  const intents = BASE_INTENT_REVENUE.map((item, i) => ({
    ...item,
    revenue: item.revenue + delta(item.revenue, i + 30),
    impressions: item.impressions + delta(item.impressions, i + 40),
    conversions: item.conversions + delta(item.conversions, i + 50),
  }));

  const zones = BASE_ZONE_REVENUE.map((z, i) => ({
    ...z,
    revenue: z.revenue + delta(z.revenue, i + 60),
    impressions: z.impressions + delta(z.impressions, i + 70),
  }));

  const campaigns = BASE_CAMPAIGN_REVENUE.map((c, i) => ({
    ...c,
    revenue: c.revenue + delta(c.revenue, i + 80),
    impressions: c.impressions + delta(c.impressions, i + 90),
    clicks: c.clicks + delta(c.clicks, i + 100),
  }));

  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalCoupons = campaigns.reduce((s, c) => s + c.couponsRedeemed, 0);

  return { languages, intents, zones, campaigns, totalRevenue, totalImpressions, totalClicks, totalCoupons, tick };
}

// ─── Page Component ─────────────────────────────────────────────────────────

type RevenueView = 'language' | 'intent' | 'zone' | 'campaign';

export default function AnalyticsPage() {
  const [view, setView] = useState<RevenueView>('campaign');
  const sim = useRevenueSimulation();

  const avgCtr = sim.totalImpressions > 0 ? ((sim.totalClicks / sim.totalImpressions) * 100).toFixed(1) : '0';
  const revenuePerSession = (sim.totalRevenue / 12_220).toFixed(2);

  return (
    <main className="min-h-screen bg-brand-black p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Revenue Analytics</h1>
          <p className="text-brand-muted text-sm">Live sponsor revenue simulation — per campaign, language, intent, and zone</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">LIVE</span>
        </div>
      </header>

      {/* ── Revenue KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `$${sim.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10', delta: '+3.2%' },
          { label: 'Total Impressions', value: sim.totalImpressions.toLocaleString(), icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10', delta: '+1.8%' },
          { label: 'Avg CTR', value: `${avgCtr}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', delta: '+0.4%' },
          { label: 'Revenue / Session', value: `$${revenuePerSession}`, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10', delta: '+2.1%' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-brand-border bg-brand-surface p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-brand-muted/70 uppercase tracking-wide">{stat.label}</p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <span className="flex items-center gap-0.5 text-xs font-medium text-green-400">
                <ArrowUp className="h-3 w-3" />
                {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Coupons Redeemed', value: sim.totalCoupons.toLocaleString(), icon: '🎟️' },
          { label: 'Languages Active', value: '9', icon: '🌍' },
          { label: 'Active Campaigns', value: sim.campaigns.length.toString(), icon: '📣' },
          { label: 'Geo Zones', value: sim.zones.length.toString(), icon: '📍' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-brand-border bg-brand-surface p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-xs text-brand-muted/70 uppercase tracking-wide">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── View Toggle ── */}
      <div className="flex gap-1 mb-6 p-1 bg-brand-surface rounded-xl inline-flex">
        {([
          { key: 'campaign' as RevenueView, label: 'By Campaign', icon: BarChart3 },
          { key: 'language' as RevenueView, label: 'By Language', icon: Globe },
          { key: 'intent' as RevenueView, label: 'By Intent', icon: Zap },
          { key: 'zone' as RevenueView, label: 'By Zone', icon: MapPin },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              view === key ? 'bg-brand-gold text-brand-black' : 'text-brand-muted hover:text-white'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Campaign Revenue Table ── */}
      {view === 'campaign' && (
        <div className="rounded-xl border border-brand-border bg-brand-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <h2 className="font-semibold text-white">Revenue by Campaign</h2>
            </div>
            <span className="text-xs text-brand-muted/70">{sim.campaigns.length} campaigns</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-brand-muted/70 uppercase tracking-wider border-b border-brand-border">
                  <th className="px-5 py-3">Campaign</th>
                  <th className="px-5 py-3">Tier</th>
                  <th className="px-5 py-3 text-right">Revenue</th>
                  <th className="px-5 py-3 text-right">Impressions</th>
                  <th className="px-5 py-3 text-right">Clicks</th>
                  <th className="px-5 py-3 text-right">Coupons</th>
                  <th className="px-5 py-3 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {sim.campaigns
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((c) => {
                    const tc = TIER_COLORS[c.tier];
                    return (
                      <tr key={c.id} className="border-b border-brand-border/50 hover:bg-brand-border/30 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-white">{c.name}</p>
                          <p className="text-xs text-brand-muted/70">{c.sponsor}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tc.bg} ${tc.text}`}>
                            {TIER_LABELS[c.tier]}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-green-400 font-semibold">${c.revenue.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-brand-text">{c.impressions.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-brand-text">{c.clicks.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-brand-text">{c.couponsRedeemed.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right">
                          <span className={c.roas >= 3 ? 'text-green-400 font-semibold' : 'text-brand-muted'}>
                            {c.roas.toFixed(1)}x
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Revenue by Language ── */}
      {view === 'language' && (
        <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="h-4 w-4 text-blue-400" />
            <h2 className="font-semibold text-white">Revenue by Guest Language</h2>
          </div>
          <div className="space-y-4">
            {sim.languages
              .sort((a, b) => b.revenue - a.revenue)
              .map((lang) => {
                const sorted = sim.languages.sort((a, b) => b.revenue - a.revenue);
                const maxRev = (sorted[0]?.revenue) || 1;
                const pct = Math.round((lang.revenue / maxRev) * 100);
                return (
                  <div key={lang.code}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2 text-white font-medium">
                        <span className="text-lg">{lang.flag}</span>
                        {lang.name}
                        <span className="text-brand-muted/50 font-mono text-xs">({lang.code})</span>
                      </span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-brand-muted">{lang.impressions.toLocaleString()} imp</span>
                        <span className="text-brand-muted">{lang.clicks.toLocaleString()} clicks</span>
                        <span className="text-green-400 font-semibold">${lang.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-brand-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Revenue by Intent ── */}
      {view === 'intent' && (
        <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="font-semibold text-white">Revenue by User Intent</h2>
          </div>
          <div className="space-y-4">
            {sim.intents
              .sort((a, b) => b.revenue - a.revenue)
              .map((item) => {
                const sortedIntents = sim.intents.sort((a, b) => b.revenue - a.revenue);
                const maxRev = (sortedIntents[0]?.revenue) || 1;
                const pct = Math.round((item.revenue / maxRev) * 100);
                const cpc = item.conversions > 0 ? (item.revenue / item.conversions).toFixed(2) : '—';
                return (
                  <div key={item.intent}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2 text-white font-medium">
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-brand-muted">{item.conversions.toLocaleString()} conv</span>
                        <span className="text-brand-muted">${cpc}/conv</span>
                        <span className="text-green-400 font-semibold">${item.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-brand-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Revenue by Zone ── */}
      {view === 'zone' && (
        <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <h2 className="font-semibold text-white">Revenue by Geo Zone</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sim.zones
              .sort((a, b) => b.revenue - a.revenue)
              .map((zone) => (
                <div key={zone.zone} className="rounded-xl border border-brand-border bg-brand-black p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">{zone.label}</p>
                    <p className="text-lg font-bold text-green-400">${zone.revenue.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-brand-muted">
                    <span>{zone.impressions.toLocaleString()} impressions</span>
                    <span>{zone.conversions.toLocaleString()} conversions</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-brand-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${Math.round((zone.revenue / 45000) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Tier Revenue Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
        {(['SMART_PLACEMENT', 'CULTURAL_CONCIERGE', 'REWARD_ENGINE'] as const).map((tier) => {
          const items = sim.campaigns.filter((c) => c.tier === tier);
          const tierRev = items.reduce((s, c) => s + c.revenue, 0);
          const tierImp = items.reduce((s, c) => s + c.impressions, 0);
          const tierCoupons = items.reduce((s, c) => s + c.couponsRedeemed, 0);
          const tc = TIER_COLORS[tier];
          return (
            <div key={tier} className="rounded-xl border border-brand-border bg-brand-surface p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${tc.bg} ${tc.text}`}>
                  {TIER_LABELS[tier]}
                </span>
              </div>
              <p className="text-3xl font-bold text-green-400">${tierRev.toLocaleString()}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-brand-muted">
                <span>{items.length} campaigns</span>
                <span>{tierImp.toLocaleString()} imp</span>
                <span>{tierCoupons} coupons</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
