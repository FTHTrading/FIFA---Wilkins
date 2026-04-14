import Link from 'next/link';
import { TrendingUp, Eye, MousePointer, DollarSign, Globe, AlertTriangle, Users, Sparkles, ArrowUpRight, BarChart3, Zap } from 'lucide-react';

// ─── Revenue-Forward Data (mirrors analytics simulation base) ─────────────────
const TOTAL_REVENUE = 223_400;
const TOTAL_SESSIONS = 12_220;
const TOTAL_IMPRESSIONS = 41_972;
const TOTAL_CLICKS = 4_773;
const REVENUE_PER_SESSION = (TOTAL_REVENUE / TOTAL_SESSIONS).toFixed(2);
const AVG_CTR = ((TOTAL_CLICKS / TOTAL_IMPRESSIONS) * 100).toFixed(1);
const ACTIVE_LANGUAGES = 10;
const ACTIVE_CAMPAIGNS = 12;
const TELECOM_INBOUND_SMS = 3240;

const TOP_CAMPAIGNS = [
  { name: 'Coca-Cola Fan Zone', revenue: 42_300, tier: 'Platinum', roas: 8.2, color: 'text-amber-300' },
  { name: 'Delta Sky Lounge', revenue: 38_100, tier: 'Platinum', roas: 7.4, color: 'text-amber-300' },
  { name: 'Mercedes-Benz Stadium Tours', revenue: 35_800, tier: 'Platinum', roas: 6.9, color: 'text-amber-300' },
  { name: 'Uber Exit Priority', revenue: 28_900, tier: 'Gold', roas: 9.1, color: 'text-yellow-400' },
  { name: 'Chick-fil-A Halal Menu', revenue: 24_200, tier: 'Gold', roas: 11.3, color: 'text-yellow-400' },
];

const TOP_LANGUAGES = [
  { code: 'ar', name: 'Arabic', revenue: 31_200, sessions: 3_412, pct: 28, flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', revenue: 28_400, sessions: 2_891, pct: 24, flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', revenue: 18_900, sessions: 1_756, pct: 14, flag: '🇧🇷' },
  { code: 'ja', name: 'Japanese', revenue: 14_200, sessions: 987, pct: 8, flag: '🇯🇵' },
  { code: 'fr', name: 'French', revenue: 12_100, sessions: 1_123, pct: 9, flag: '🇫🇷' },
];

const TOP_INTENTS = [
  { intent: 'Food & Dining', revenue: 38_400, queries: 4_821, avgRev: 7.97 },
  { intent: 'Transport', revenue: 31_200, queries: 2_390, avgRev: 13.05 },
  { intent: 'Directions', revenue: 22_100, queries: 2_145, avgRev: 10.30 },
  { intent: 'Translation', revenue: 15_800, queries: 1_678, avgRev: 9.42 },
];

const TIER_SUMMARY = [
  { tier: 'Platinum', count: 4, revenue: 132_000, color: 'bg-amber-500/10 border-amber-500/30 text-amber-300' },
  { tier: 'Gold', count: 4, revenue: 62_400, color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  { tier: 'Silver', count: 4, revenue: 29_000, color: 'bg-brand-muted/10 border-brand-muted/30 text-brand-muted' },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-brand-black p-6">
      {/* Header with CTA */}
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Revenue Dashboard</h1>
          <p className="text-brand-muted text-sm">Executive summary — monetization, reach & engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/telecom"
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500/20 hover:border-emerald-400/50"
          >
            Text FIFA
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-1.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 px-4 py-2 text-sm font-medium text-fuchsia-300 transition-all hover:bg-fuchsia-500/20 hover:border-fuchsia-400/50"
          >
            <BarChart3 className="h-4 w-4" />
            Full Analytics
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero revenue card */}
      <div className="relative mb-8 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-950/40 via-brand-surface to-emerald-950/30 p-6 overflow-hidden">
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-400/70 mb-1">Total Sponsor Revenue</p>
            <p className="text-5xl font-bold text-white font-display tracking-tight">
              ${TOTAL_REVENUE.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-brand-muted">
              {ACTIVE_CAMPAIGNS} campaigns · {ACTIVE_LANGUAGES} languages · {TOTAL_SESSIONS.toLocaleString()} sessions
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-brand-muted/70 uppercase tracking-wide mb-1">Revenue / Session</p>
            <p className="text-2xl font-bold text-green-400">${REVENUE_PER_SESSION}</p>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sessions', value: TOTAL_SESSIONS.toLocaleString(), icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
          { label: 'Impressions', value: TOTAL_IMPRESSIONS.toLocaleString(), icon: Eye, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
          { label: 'Avg CTR', value: `${AVG_CTR}%`, icon: MousePointer, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
          { label: 'Text FIFA Inbound', value: TELECOM_INBOUND_SMS.toLocaleString(), icon: Sparkles, color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-brand-border bg-brand-surface p-5 transition-all hover:border-brand-gold/40">
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xs text-brand-muted/70 uppercase tracking-wide">{stat.label}</p>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tier summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {TIER_SUMMARY.map((t) => (
          <div key={t.tier} className={`rounded-xl border p-4 ${t.color}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider">{t.tier}</p>
              <span className="text-xs opacity-60">{t.count} campaigns</span>
            </div>
            <p className="text-2xl font-bold text-white">${t.revenue.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Top campaigns table */}
      <div className="rounded-xl border border-brand-border bg-brand-surface mb-8 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <h2 className="font-semibold text-white">Top Campaigns by Revenue</h2>
          </div>
          <Link href="/analytics" className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
            View all {ACTIVE_CAMPAIGNS} →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-brand-muted/70 uppercase tracking-wider border-b border-brand-border">
                <th className="px-5 py-3">Campaign</th>
                <th className="px-5 py-3 text-right">Tier</th>
                <th className="px-5 py-3 text-right">Revenue</th>
                <th className="px-5 py-3 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {TOP_CAMPAIGNS.map((c) => (
                <tr key={c.name} className="border-b border-brand-border/50 hover:bg-brand-border/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-xs font-semibold ${c.color}`}>{c.tier}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-green-400 font-semibold">${c.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-brand-text">{c.roas}x</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom: Revenue by Language + Revenue by Intent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by language */}
        <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-blue-400" />
            <h2 className="font-semibold text-white">Revenue by Language</h2>
          </div>
          <div className="space-y-3">
            {TOP_LANGUAGES.map((lang) => (
              <div key={lang.code}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-brand-text">
                    {lang.flag} {lang.name} <span className="text-brand-muted/50">({lang.code})</span>
                  </span>
                  <span className="text-green-400 font-semibold">${lang.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-brand-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${(lang.revenue / 31_200) * 100}%` }}
                  />
                </div>
                <p className="text-2xs text-brand-muted/50 mt-0.5">{lang.sessions.toLocaleString()} sessions · {lang.pct}% of traffic</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by intent */}
        <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="font-semibold text-white">Revenue by AI Intent</h2>
          </div>
          <div className="space-y-3">
            {TOP_INTENTS.map((intent) => (
              <div key={intent.intent}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-brand-text">{intent.intent}</span>
                  <span className="text-green-400 font-semibold">${intent.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-brand-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
                    style={{ width: `${(intent.revenue / 38_400) * 100}%` }}
                  />
                </div>
                <p className="text-2xs text-brand-muted/50 mt-0.5">{intent.queries.toLocaleString()} queries · ${intent.avgRev}/query avg</p>
              </div>
            ))}
          </div>
          <Link
            href="/analytics"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-brand-border py-2 text-xs font-medium text-brand-muted transition-all hover:border-brand-gold/30 hover:text-brand-gold"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Explore full analytics
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </main>
  );
}
