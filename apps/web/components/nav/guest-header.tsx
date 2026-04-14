'use client';

import Link from 'next/link';
import { Globe, Bell } from 'lucide-react';
import { cn } from '@wilkins/ui';

export function GuestHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        {/* Wordmark */}
        <Link href="/event" className="flex items-center gap-2">
          <span className="font-display text-sm font-bold tracking-tight text-brand-text">
            Wilkins <span className="text-brand-gold">Media</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <Link
            href="/select-language"
            className={cn(
              'flex items-center gap-1.5 rounded-lg border border-brand-border bg-brand-surface',
              'px-2.5 py-1.5 text-xs font-medium text-brand-muted',
              'hover:border-brand-gold hover:text-brand-gold transition-all',
            )}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>EN</span>
          </Link>

          {/* Alerts */}
          <Link
            href="/event/alerts"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text transition-all"
          >
            <Bell className="h-4 w-4" />
            {/* Alert dot */}
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-electric" />
          </Link>
        </div>
      </div>
    </header>
  );
}
