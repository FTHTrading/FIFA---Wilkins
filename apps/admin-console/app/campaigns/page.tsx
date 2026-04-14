'use client';

import { useState } from 'react';
import {
  Target, Globe, MapPin, Zap, BarChart3, TrendingUp,
  DollarSign, Filter, Users, Trophy, Gift, SlidersHorizontal, Clock3,
} from 'lucide-react';

// ─── Mock Data (mirrors seed-atlanta.ts) ────────────────────────────────

type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'COMPLETED';
type SponsorTier = 'SMART_PLACEMENT' | 'CULTURAL_CONCIERGE' | 'REWARD_ENGINE';

interface Campaign {
  id: string;
  name: string;
  sponsorName: string;
  tier: SponsorTier;
  placement: string;
  targetLanguages: string[];
  impressions: number;
  clicks: number;
  spend: number;
  status: CampaignStatus;
  startsAt: string;
  endsAt: string;
}

interface CampaignDraft {
  name: string;
  sponsorName: string;
  tier: SponsorTier;
  placement: string;
  budget: number;
  targetIntent: string;
  geoRadiusM: number;
  timeWindow: 'ALL_DAY' | 'PRE_MATCH' | 'HALFTIME' | 'POST_MATCH';
  rewardObject: 'NONE' | 'COUPON' | 'BADGE' | 'PASSPORT_STAMP';
  targetLanguages: string[];
}

const CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Coca-Cola Fan Zone Promotion', sponsorName: 'Coca-Cola', tier: 'SMART_PLACEMENT', placement: 'concierge_card', targetLanguages: ['en', 'es', 'pt', 'fr'], impressions: 14832, clicks: 1247, spend: 2450, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '2', name: 'MARTA Transit Pass', sponsorName: 'MARTA', tier: 'SMART_PLACEMENT', placement: 'map_overlay', targetLanguages: [], impressions: 11205, clicks: 891, spend: 1800, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '3', name: 'CVS Pharmacy — Stadium Essentials', sponsorName: 'CVS', tier: 'SMART_PLACEMENT', placement: 'search_result', targetLanguages: [], impressions: 4210, clicks: 387, spend: 680, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '4', name: 'Verizon Fan Connectivity', sponsorName: 'Verizon', tier: 'SMART_PLACEMENT', placement: 'home_banner', targetLanguages: ['en'], impressions: 18900, clicks: 1523, spend: 3100, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '5', name: 'Chick-fil-A Halal Menu Launch', sponsorName: 'Chick-fil-A', tier: 'CULTURAL_CONCIERGE', placement: 'concierge_card', targetLanguages: ['ar', 'fr'], impressions: 6314, clicks: 892, spend: 4200, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '6', name: 'Delta Sky Lounge — Premium Transit', sponsorName: 'Delta Air Lines', tier: 'CULTURAL_CONCIERGE', placement: 'concierge_card', targetLanguages: ['en', 'ja', 'ko', 'de'], impressions: 9621, clicks: 743, spend: 5800, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '7', name: 'Uber — Post-Match Priority Pickup', sponsorName: 'Uber', tier: 'CULTURAL_CONCIERGE', placement: 'map_overlay', targetLanguages: [], impressions: 22100, clicks: 3891, spend: 8200, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '8', name: 'Hyatt Regency — Guest Welcome Package', sponsorName: 'Hyatt', tier: 'CULTURAL_CONCIERGE', placement: 'language_select', targetLanguages: ['ar', 'es', 'pt', 'fr', 'ja', 'ko', 'zh-CN', 'de'], impressions: 8740, clicks: 612, spend: 4500, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '9', name: 'Adidas — FIFA Kit Scavenger Hunt', sponsorName: 'Adidas', tier: 'REWARD_ENGINE', placement: 'concierge_card', targetLanguages: [], impressions: 7850, clicks: 1045, spend: 15000, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '10', name: 'World of Coca-Cola — Cultural Passport', sponsorName: 'Coca-Cola', tier: 'REWARD_ENGINE', placement: 'concierge_card', targetLanguages: ['en', 'es', 'pt', 'ar', 'fr'], impressions: 5410, clicks: 934, spend: 12000, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '11', name: 'Discover Atlanta — City Explorer Badge', sponsorName: 'Discover Atlanta', tier: 'REWARD_ENGINE', placement: 'home_banner', targetLanguages: [], impressions: 4320, clicks: 578, spend: 8500, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
  { id: '12', name: 'Mercedes-Benz — Stadium VIP Upgrade', sponsorName: 'Mercedes-Benz', tier: 'REWARD_ENGINE', placement: 'poi_detail', targetLanguages: ['en', 'de'], impressions: 3180, clicks: 412, spend: 22000, status: 'ACTIVE', startsAt: '2026-06-11', endsAt: '2026-07-19' },
];

const TIER_CONFIG: Record<SponsorTier, { label: string; color: string; bg: string; icon: typeof Target }> = {
  SMART_PLACEMENT: { label: 'Smart Placement', color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: MapPin },
  CULTURAL_CONCIERGE: { label: 'Cultural Concierge', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Globe },
  REWARD_ENGINE: { label: 'Reward Engine', color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', icon: Trophy },
};

const PLACEMENT_LABELS: Record<string, string> = {
  home_banner: 'Home Banner',
  map_overlay: 'Map Overlay',
  concierge_card: 'Concierge Card',
  language_select: 'Language Select',
  search_result: 'Search Result',
  poi_detail: 'POI Detail',
};

const AVAILABLE_LANGUAGES = ['en', 'es', 'pt', 'fr', 'ar', 'ja', 'ko', 'zh-CN', 'de', 'it'] as const;

const TARGET_INTENTS = [
  'food-cultural',
  'restroom',
  'medical',
  'transport',
  'exit',
  'translation',
  'family_support',
  'hospitality',
] as const;

const DEFAULT_DRAFT: CampaignDraft = {
  name: 'New Sponsor Campaign',
  sponsorName: 'Partner Brand',
  tier: 'SMART_PLACEMENT',
  placement: 'concierge_card',
  budget: 2500,
  targetIntent: 'food-cultural',
  geoRadiusM: 500,
  timeWindow: 'HALFTIME',
  rewardObject: 'COUPON',
  targetLanguages: ['en', 'es'],
};

// ─── Component ──────────────────────────────────────────────────────────

export default function CampaignsPage() {
  const [tierFilter, setTierFilter] = useState<SponsorTier | 'ALL'>('ALL');
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState<CampaignDraft>(DEFAULT_DRAFT);

  const filtered = tierFilter === 'ALL' ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.tier === tierFilter);

  const totalImpressions = filtered.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = filtered.reduce((s, c) => s + c.clicks, 0);
  const totalRevenue = filtered.reduce((s, c) => s + c.spend, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';

  const previewScore = {
    intentMatch: draft.targetIntent === 'food-cultural' ? 0.9 : 0.75,
    culturalMatch: Math.min(1, 0.4 + draft.targetLanguages.length * 0.08),
    proximity: Math.max(0.2, 1 - draft.geoRadiusM / 2000),
    trust: 0.82,
    sponsorPriority: draft.tier === 'REWARD_ENGINE' ? 0.9 : draft.tier === 'CULTURAL_CONCIERGE' ? 0.8 : 0.7,
    timeRelevance: draft.timeWindow === 'HALFTIME' || draft.timeWindow === 'POST_MATCH' ? 0.9 : 0.75,
  };

  const finalPreviewScore = (
    previewScore.intentMatch * 0.28 +
    previewScore.culturalMatch * 0.22 +
    previewScore.proximity * 0.15 +
    previewScore.trust * 0.1 +
    previewScore.sponsorPriority * 0.15 +
    previewScore.timeRelevance * 0.1
  ).toFixed(2);

  // Tier breakdown summary
  const tierSummary = (['SMART_PLACEMENT', 'CULTURAL_CONCIERGE', 'REWARD_ENGINE'] as SponsorTier[]).map((tier) => {
    const items = CAMPAIGNS.filter((c) => c.tier === tier);
    return {
      tier,
      count: items.length,
      revenue: items.reduce((s, c) => s + c.spend, 0),
      impressions: items.reduce((s, c) => s + c.impressions, 0),
    };
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Campaign Manager</h1>
          <p className="text-slate-400 text-sm">Sponsor campaigns, cultural targeting, and performance analytics</p>
        </div>
        <button
          type="button"
          onClick={() => setShowComposer((v) => !v)}
          className="rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 transition-colors px-4 py-2 text-sm font-medium text-white"
        >
          {showComposer ? 'Hide Composer' : '+ New Campaign'}
        </button>
      </header>

      {showComposer && (
        <section className="mb-8 rounded-xl border border-fuchsia-500/30 bg-slate-900 p-5">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-fuchsia-400" />
            <h2 className="font-semibold text-white">Campaign Composer</h2>
            <span className="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-xs text-fuchsia-300">Draft</span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <label className="text-sm text-slate-300">
              Campaign Name
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>

            <label className="text-sm text-slate-300">
              Sponsor
              <input
                value={draft.sponsorName}
                onChange={(e) => setDraft((d) => ({ ...d, sponsorName: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>

            <label className="text-sm text-slate-300">
              Sponsor Tier
              <select
                value={draft.tier}
                onChange={(e) => setDraft((d) => ({ ...d, tier: e.target.value as SponsorTier }))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                <option value="SMART_PLACEMENT">Smart Placement</option>
                <option value="CULTURAL_CONCIERGE">Cultural Concierge</option>
                <option value="REWARD_ENGINE">Reward Engine</option>
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Placement
              <select
                value={draft.placement}
                onChange={(e) => setDraft((d) => ({ ...d, placement: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Intent Target
              <select
                value={draft.targetIntent}
                onChange={(e) => setDraft((d) => ({ ...d, targetIntent: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                {TARGET_INTENTS.map((intent) => (
                  <option key={intent} value={intent}>{intent}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-300">
              Reward Object
              <select
                value={draft.rewardObject}
                onChange={(e) => setDraft((d) => ({ ...d, rewardObject: e.target.value as CampaignDraft['rewardObject'] }))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                <option value="NONE">None</option>
                <option value="COUPON">Coupon</option>
                <option value="BADGE">Badge</option>
                <option value="PASSPORT_STAMP">Passport Stamp</option>
              </select>
            </label>

            <label className="text-sm text-slate-300 lg:col-span-2">
              Target Languages
              <div className="mt-2 flex flex-wrap gap-2">
                {AVAILABLE_LANGUAGES.map((lang) => {
                  const selected = draft.targetLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setDraft((d) => ({
                        ...d,
                        targetLanguages: selected
                          ? d.targetLanguages.filter((l) => l !== lang)
                          : [...d.targetLanguages, lang],
                      }))}
                      className={`rounded-md border px-2 py-1 text-xs font-mono transition-colors ${
                        selected
                          ? 'border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-200'
                          : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </label>

            <label className="text-sm text-slate-300">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" /> Geo Radius ({draft.geoRadiusM}m)
              </span>
              <input
                type="range"
                min={100}
                max={2500}
                step={50}
                value={draft.geoRadiusM}
                onChange={(e) => setDraft((d) => ({ ...d, geoRadiusM: Number(e.target.value) }))}
                className="mt-2 w-full"
              />
            </label>

            <label className="text-sm text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5 text-amber-400" /> Matchday Window
              </span>
              <select
                value={draft.timeWindow}
                onChange={(e) => setDraft((d) => ({ ...d, timeWindow: e.target.value as CampaignDraft['timeWindow'] }))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              >
                <option value="ALL_DAY">All Day</option>
                <option value="PRE_MATCH">Pre-Match</option>
                <option value="HALFTIME">Halftime</option>
                <option value="POST_MATCH">Post-Match Exit</option>
              </select>
            </label>

            <label className="text-sm text-slate-300 lg:col-span-2">
              Budget (USD)
              <input
                type="number"
                min={100}
                step={100}
                value={draft.budget}
                onChange={(e) => setDraft((d) => ({ ...d, budget: Number(e.target.value) || 0 }))}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
            <p className="text-xs uppercase tracking-wider text-slate-500">Ranking Preview</p>
            <p className="mt-1 font-mono text-xs text-slate-400">
              final_score = intent_match + cultural_match + proximity + trust + sponsor_priority + time_relevance
            </p>
            <p className="mt-2 text-sm">
              Preview score: <span className="font-semibold text-fuchsia-300">{finalPreviewScore}</span>
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500">
              Save Draft
            </button>
            <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800">
              Preview Placement
            </button>
          </div>
        </section>
      )}

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Campaigns', value: filtered.length.toString(), icon: Target, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
          { label: 'Total Impressions', value: totalImpressions.toLocaleString(), icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Avg CTR', value: `${avgCtr}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">{stat.label}</p>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Sponsor Tier Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {tierSummary.map((ts) => {
          const cfg = TIER_CONFIG[ts.tier];
          const Icon = cfg.icon;
          return (
            <button
              key={ts.tier}
              onClick={() => setTierFilter(tierFilter === ts.tier ? 'ALL' : ts.tier)}
              className={`rounded-xl border p-5 text-left transition-all ${
                tierFilter === ts.tier
                  ? 'border-fuchsia-500 bg-fuchsia-500/5 ring-1 ring-fuchsia-500/30'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg}`}>
                  <Icon className={`h-4 w-4 ${cfg.color}`} />
                </div>
                <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{ts.count}</p>
                  <p className="text-xs text-slate-500">campaigns</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-400">${ts.revenue.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{ts.impressions.toLocaleString()} imp</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Campaign Table ── */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden mb-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <h2 className="font-semibold text-white">
              {tierFilter === 'ALL' ? 'All Campaigns' : TIER_CONFIG[tierFilter].label}
            </h2>
          </div>
          <span className="text-xs text-slate-500">{filtered.length} campaigns</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3">Tier</th>
                <th className="px-5 py-3">Placement</th>
                <th className="px-5 py-3">Languages</th>
                <th className="px-5 py-3 text-right">Impressions</th>
                <th className="px-5 py-3 text-right">Clicks</th>
                <th className="px-5 py-3 text-right">CTR</th>
                <th className="px-5 py-3 text-right">Revenue</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(1) : '0';
                const cfg = TIER_CONFIG[c.tier];
                return (
                  <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-white">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.sponsorName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-300 text-xs">
                      {PLACEMENT_LABELS[c.placement] || c.placement}
                    </td>
                    <td className="px-5 py-3">
                      {c.targetLanguages.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.targetLanguages.slice(0, 4).map((l) => (
                            <span key={l} className="inline-flex items-center rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                              {l}
                            </span>
                          ))}
                          {c.targetLanguages.length > 4 && (
                            <span className="text-[10px] text-slate-500">+{c.targetLanguages.length - 4}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">All</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-slate-300">{c.impressions.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-slate-300">{c.clicks.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-semibold ${Number(ctr) >= 10 ? 'text-green-400' : 'text-slate-300'}`}>
                        {ctr}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-green-400 font-semibold">${c.spend.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Challenges & Rewards Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Challenges */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="font-semibold text-white">Active Challenges</h2>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Coca-Cola Cultural Passport', type: 'Multi-Step', reward: '100 pts + Free Tour', completions: 342 },
              { name: 'Adidas Stadium Scavenger Hunt', type: 'Scavenger Hunt', reward: '200 pts + Jersey', completions: 89 },
              { name: 'MARTA Explorer', type: 'Visit', reward: '30 pts + Day Pass', completions: 1204 },
              { name: 'Translation Bridge Challenge', type: 'Check-in', reward: '75 pts', completions: 456 },
              { name: 'Halftime Speed Run', type: 'Multi-Step', reward: '15 pts', completions: 2100 },
              { name: 'Mercedes-Benz Fan Quiz', type: 'Survey', reward: '50 pts + VIP Chance', completions: 678 },
            ].map((ch) => (
              <div key={ch.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <p className="text-sm font-medium text-white">{ch.name}</p>
                  <p className="text-xs text-slate-500">{ch.type} · {ch.reward}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-400">{ch.completions.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reward Badges */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-4 w-4 text-fuchsia-400" />
            <h2 className="font-semibold text-white">Reward Badges</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🌍', name: 'Welcome Explorer', tier: 'Bronze', claimed: 8421, color: 'border-orange-800/50' },
              { icon: '🍽️', name: 'Foodie Passport', tier: 'Silver', claimed: 2314, color: 'border-slate-400/30' },
              { icon: '🤝', name: 'Cultural Ambassador', tier: 'Gold', claimed: 456, color: 'border-amber-500/50' },
              { icon: '🏟️', name: 'Stadium Navigator', tier: 'Bronze', claimed: 5890, color: 'border-orange-800/50' },
              { icon: '🦸', name: 'Emergency Hero', tier: 'Gold', claimed: 34, color: 'border-amber-500/50' },
              { icon: '🚇', name: 'Transit Pro', tier: 'Silver', claimed: 1204, color: 'border-slate-400/30' },
              { icon: '🥤', name: 'Coca-Cola Superfan', tier: 'Silver', claimed: 3421, color: 'border-slate-400/30' },
              { icon: '👟', name: 'Adidas Quest Champion', tier: 'Platinum', claimed: 89, color: 'border-fuchsia-500/50' },
              { icon: '🗺️', name: 'City Explorer', tier: 'Gold', claimed: 678, color: 'border-amber-500/50' },
              { icon: '⚡', name: 'Halftime Hustler', tier: 'Bronze', claimed: 2100, color: 'border-orange-800/50' },
            ].map((b) => (
              <div key={b.name} className={`flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border ${b.color}`}>
                <span className="text-2xl">{b.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{b.name}</p>
                  <p className="text-xs text-slate-500">{b.tier} · {b.claimed.toLocaleString()} claimed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
