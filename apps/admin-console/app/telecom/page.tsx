import Link from 'next/link';

interface TelecomSummaryResponse {
  number: string;
  inboundTotal: number;
  outboundTotal: number;
  emergencyCount: number;
  sponsorImpressions: number;
  rewardClaims: number;
  mapLinkOpens: number;
  conversionRate: number;
  languageBreakdown: Array<{ language: string | null; count: number }>;
  intentBreakdown: Array<{ intent: string | null; count: number }>;
  providerStatus: {
    configured: boolean;
    healthy: boolean;
    details: string;
  };
}

async function getTelecomSummary(): Promise<TelecomSummaryResponse | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
  const res = await fetch(`${apiBase}/telecom/summary?days=7`, { cache: 'no-store' });
  if (!res.ok) return null;
  return (await res.json()) as TelecomSummaryResponse;
}

export default async function TelecomPage() {
  const summary = await getTelecomSummary();

  return (
    <main className="min-h-screen bg-slate-950 p-6">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">Telecom Analytics</h1>
          <p className="text-slate-400 text-sm">Wilkins Media FIFA AI Connection System</p>
          <p className="text-slate-300 text-sm mt-1">Text FIFA: +1-888-827-3432</p>
        </div>
        <Link href="/dashboard" className="text-sm text-fuchsia-300 hover:text-fuchsia-200">
          Back to Dashboard →
        </Link>
      </header>

      {!summary && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
          Telecom summary is unavailable. Confirm API is running and Telnyx env is configured.
        </div>
      )}

      {summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Inbound SMS" value={summary.inboundTotal.toLocaleString()} />
            <StatCard label="Outbound SMS" value={summary.outboundTotal.toLocaleString()} />
            <StatCard label="Emergency SMS" value={summary.emergencyCount.toLocaleString()} />
            <StatCard label="Sponsor Impressions" value={summary.sponsorImpressions.toLocaleString()} />
            <StatCard label="Reward Claims" value={summary.rewardClaims.toLocaleString()} />
            <StatCard label="Map Link Opens" value={summary.mapLinkOpens.toLocaleString()} />
            <StatCard label="Conversion Rate" value={`${(summary.conversionRate * 100).toFixed(1)}%`} />
            <StatCard
              label="Provider Health"
              value={summary.providerStatus.healthy ? 'Healthy' : 'Degraded'}
              tone={summary.providerStatus.healthy ? 'good' : 'warn'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BreakdownCard
              title="Messages by Language"
              rows={summary.languageBreakdown.map((item) => ({
                key: item.language ?? 'unknown',
                count: item.count,
              }))}
            />
            <BreakdownCard
              title="Messages by Intent"
              rows={summary.intentBreakdown.map((item) => ({
                key: item.intent ?? 'unknown',
                count: item.count,
              }))}
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 mt-6">
            <h2 className="font-semibold text-white mb-2">Provider Status</h2>
            <p className="text-sm text-slate-400">{summary.providerStatus.details}</p>
            <p className="text-xs text-slate-500 mt-2">Active number: {summary.number}</p>
          </div>
        </>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'warn';
}) {
  const toneClass =
    tone === 'good'
      ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
      : tone === 'warn'
      ? 'text-amber-300 border-amber-500/30 bg-amber-500/10'
      : 'text-slate-200 border-slate-800 bg-slate-900';

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function BreakdownCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ key: string; count: number }>;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="font-semibold text-white mb-4">{title}</h2>
      <div className="space-y-3">
        {rows.length === 0 && <p className="text-sm text-slate-500">No data yet.</p>}
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between text-sm">
            <span className="text-slate-300">{row.key}</span>
            <span className="text-fuchsia-300 font-semibold">{row.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
