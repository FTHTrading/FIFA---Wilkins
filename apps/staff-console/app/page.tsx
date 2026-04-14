import Link from 'next/link';

export default function StaffHome() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-black">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display tracking-tight text-white">
            Staff Console
          </h1>
          <p className="text-brand-muted">
            Wilkins Media · Translation Queue &amp; Assistance
          </p>
        </div>

        <div className="grid gap-4 pt-6">
          <Link
            href="/queue"
            className="block rounded-xl bg-brand-success hover:bg-brand-success/80 transition-colors p-4 text-lg font-semibold text-white"
          >
            Translation Queue
          </Link>
          <Link
            href="/emergency"
            className="block rounded-xl bg-brand-danger hover:bg-brand-danger/80 transition-colors p-4 text-lg font-semibold text-white"
          >
            Emergency Alerts
          </Link>
        </div>

        <p className="text-xs text-brand-muted pt-8">
          Sign in with your staff credentials to view the queue.
        </p>
      </div>
    </main>
  );
}
