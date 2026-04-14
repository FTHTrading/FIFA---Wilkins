'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/events', label: 'Events', icon: '📅' },
  { href: '/translations', label: 'Translations', icon: '🌐' },
  { href: '/emergency', label: 'Emergency', icon: '🚨' },
  { href: '/concierge', label: 'Concierge', icon: '🍽' },
  { href: '/campaigns', label: 'Campaigns', icon: '📣' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/staff', label: 'Staff', icon: '👥' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-brand-navy border-r border-brand-border flex flex-col h-full">
      {/* Wordmark */}
      <div className="px-5 py-5 border-b border-brand-border">
        <span className="font-display font-bold text-lg text-white">
          Wilkins <span className="text-brand-gold">Media</span>
        </span>
        <p className="text-xs text-brand-muted mt-0.5">Admin Console</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-brand-gold/10 text-brand-gold font-medium'
                  : 'text-brand-muted hover:text-white hover:bg-brand-surface'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-brand-border">
        <p className="text-xs text-brand-muted">Wilkins Media Global Guest OS</p>
        <p className="text-xs text-brand-muted opacity-50">v1.0.0-alpha</p>
      </div>
    </aside>
  );
}
