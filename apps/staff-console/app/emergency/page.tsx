async function getTelecomEmergencySnapshot() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
    const res = await fetch(`${apiBase}/telecom/summary?days=1`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { emergencyCount?: number; inboundTotal?: number };
    return {
      emergencyCount: json.emergencyCount ?? 0,
      inboundTotal: json.inboundTotal ?? 0,
    };
  } catch {
    return null;
  }
}

export default async function EmergencyPage() {
  const snapshot = await getTelecomEmergencySnapshot();
  const emergencyCount = snapshot?.emergencyCount ?? 0;
  const inboundTotal = snapshot?.inboundTotal ?? 0;

  return (
    <main className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold font-display text-red-400">Emergency Alerts</h1>
        <p className="text-slate-400 text-sm">Active incident monitoring and escalation</p>
        <p className="text-sm text-slate-300 mt-2">Text FIFA: +1-888-827-3432</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-5">
          <p className="text-xs uppercase tracking-wide text-red-300">Emergency SMS (24h)</p>
          <p className="text-3xl font-bold text-white mt-1">{emergencyCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Inbound SMS (24h)</p>
          <p className="text-3xl font-bold text-white mt-1">{inboundTotal}</p>
        </div>
      </div>

      <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-8 text-center">
        <p className="text-slate-200">Emergency incidents appear here with staff escalation context.</p>
        <p className="text-xs text-slate-400 mt-2">
          Telecom emergency routes from "hospital", "lost child", "police", and "I am lost" are prioritized over sponsor logic.
        </p>
      </div>
    </main>
  );
}
