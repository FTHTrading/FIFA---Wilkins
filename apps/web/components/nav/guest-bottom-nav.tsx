'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, MessageSquare, Home, Utensils, TriangleAlert, Trophy } from 'lucide-react';
import { cn } from '@wilkins/ui';

const NAV_ITEMS = [
  { href: '/event', icon: Home, label: 'Home' },
  { href: '/event/map', icon: MapPin, label: 'Map' },
  { href: '/event/translate', icon: MessageSquare, label: 'Translate' },
  { href: '/event/concierge', icon: Utensils, label: 'Concierge' },
  { href: '/event/rewards', icon: Trophy, label: 'Rewards' },
  { href: '/event/emergency', icon: TriangleAlert, label: 'Emergency', emergency: true },
];

export function GuestBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-border bg-brand-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/event' && pathname.startsWith(item.href));

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
  );
}
