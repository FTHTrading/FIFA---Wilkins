export default function QueuePage() {
  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Translation Queue</h1>
          <p className="text-slate-400 text-sm">Pending guest requests</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Connected
          </span>
        </div>
      </header>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <p className="text-slate-500">No pending requests</p>
        <p className="text-xs text-slate-600 mt-2">
          New guest assistance requests will appear here in real time.
        </p>
      </div>
    </main>
  );
}
