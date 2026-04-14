'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navigation, Utensils, Trophy, ShieldAlert, Home } from 'lucide-react';
import { cn } from '@wilkins/ui';

// ─── TAP FIFA Bottom Nav ──────────────────────────────────────────────────────

const TAP_NAV: ReadonlyArray<{
  href: string;
  icon: typeof Home;
  label: string;
  emergency?: boolean;
}> = [
  { href: '/tap', icon: Home, label: 'Home' },
  { href: '/tap/directions', icon: Navigation, label: 'Directions' },
  { href: '/tap/food', icon: Utensils, label: 'Food' },
  { href: '/tap/rewards', icon: Trophy, label: 'Rewards' },
  { href: '/tap/help', icon: ShieldAlert, label: 'Help', emergency: true },
];

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function TapLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-brand-black">
      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <Link href="/tap" className="flex items-center gap-2">
            <span className="font-display text-base font-black tracking-tight text-white">
              TAP <span className="text-brand-gold">FIFA</span>
            </span>
          </Link>
          <a
            href="tel:+18888273432"
            className="rounded-lg border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-gold hover:bg-brand-gold/10 transition-colors"
          >
            1-888-827-3432
          </a>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────── */}
      <main className="flex-1 pb-24">{children}</main>

      {/* ── Bottom Nav ────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-border bg-brand-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          {TAP_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/tap' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all',
                  isActive && !item.emergency && 'text-brand-gold',
                  !isActive && !item.emergency && 'text-brand-muted hover:text-brand-text',
                  item.emergency && 'text-brand-emergency hover:opacity-80',
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-2xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
