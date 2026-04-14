import Link from 'next/link';

export default function StaffHome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display tracking-tight">
            Staff Console
          </h1>
          <p className="text-slate-400">
            Wilkins Media · Translation Queue &amp; Assistance
          </p>
        </div>

        <div className="grid gap-4 pt-6">
          <Link
            href="/queue"
            className="block rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors p-4 text-lg font-semibold"
          >
            Translation Queue
          </Link>
          <Link
            href="/emergency"
            className="block rounded-xl bg-red-600 hover:bg-red-500 transition-colors p-4 text-lg font-semibold"
          >
            Emergency Alerts
          </Link>
        </div>

        <p className="text-xs text-slate-500 pt-8">
          Sign in with your staff credentials to view the queue.
        </p>
      </div>
    </main>
  );
}
