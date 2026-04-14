import type { Metadata } from 'next';
import { GuestBottomNav } from '@/components/nav/guest-bottom-nav';
import { GuestHeader } from '@/components/nav/guest-header';
import { GuestSessionProvider } from '@/components/providers/guest-session-provider';
import { DemoModePanel } from '@/components/demo-mode-panel';

export const metadata: Metadata = {
  title: { default: 'Wilkins Media Global Guest OS', template: '%s — Wilkins Media' },
};

interface GuestLayoutProps {
  children: React.ReactNode;
  params: { lang?: string };
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <GuestSessionProvider>
      <div className="flex min-h-screen flex-col bg-brand-black">
        <GuestHeader />
        <DemoModePanel />
        <main className="flex-1 pb-24">{children}</main>
        <GuestBottomNav />
      </div>
    </GuestSessionProvider>
  );
}
