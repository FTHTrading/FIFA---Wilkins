import Link from 'next/link';

const sections = [
  { href: '/dashboard', label: 'Dashboard', description: 'Live session stats and language breakdown', color: 'bg-indigo-600' },
  { href: '/events', label: 'Events', description: 'Manage events, venues, and POIs', color: 'bg-cyan-600' },
  { href: '/translations', label: 'Translations', description: 'Review and approve AI translations', color: 'bg-amber-600' },
  { href: '/emergency', label: 'Emergency', description: 'Emergency phrase management', color: 'bg-red-600' },
  { href: '/campaigns', label: 'Campaigns', description: 'Sponsor campaigns and targeting', color: 'bg-fuchsia-600' },
  { href: '/analytics', label: 'Analytics', description: 'Reports and performance metrics', color: 'bg-violet-600' },
];

export default function AdminConsolePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-display tracking-tight">
            Admin Console
          </h1>
          <p className="text-slate-400">
            Wilkins Media · Event Administration &amp; Analytics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 transition-colors p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="font-semibold text-lg">{s.label}</span>
              </div>
              <p className="text-sm text-slate-400">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
