export default function EmergencyPage() {
  return (
    <main className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold font-display text-red-400">Emergency Alerts</h1>
        <p className="text-slate-400 text-sm">Active incident monitoring and escalation</p>
      </header>

      <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-8 text-center">
        <p className="text-slate-400">No active emergencies</p>
        <p className="text-xs text-slate-600 mt-2">
          Emergency incidents will appear here with priority flags and escalation controls.
        </p>
      </div>
    </main>
  );
}
