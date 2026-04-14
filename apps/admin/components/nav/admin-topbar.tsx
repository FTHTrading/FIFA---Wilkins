'use client';

import { usePathname } from 'next/navigation';
import { Badge } from '@wilkins/ui';

const PATH_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/events': 'Events',
  '/translations': 'Translations',
  '/emergency': 'Emergency Monitor',
  '/concierge': 'Concierge',
  '/campaigns': 'Campaigns',
  '/analytics': 'Analytics',
  '/staff': 'Staff',
  '/settings': 'Settings',
};

export function AdminTopbar() {
  const pathname = usePathname();
  const label = PATH_LABELS[pathname] ?? 'Admin';

  return (
    <header className="h-14 bg-brand-navy border-b border-brand-border flex items-center justify-between px-6 shrink-0">
      <h2 className="font-display font-semibold text-white text-sm">{label}</h2>
      <div className="flex items-center gap-3">
        <Badge variant="info" className="text-2xs">atlanta-2026</Badge>
        <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold text-xs font-bold">
          WM
        </div>
      </div>
    </header>
  );
}
