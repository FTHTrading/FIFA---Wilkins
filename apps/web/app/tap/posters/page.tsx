'use client';

/**
 * Printable QR poster generator for Tap FIFA.
 * Access at /tap/posters - renders 5 print-ready poster cards.
 * Print with Ctrl+P - each card is a full page.
 *
 * Uses real scannable SVG QR codes for production print campaigns.
 */

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// --- Poster definitions ------------------------------------------------------
const BASE_URL =
  typeof window !== 'undefined' ? window.location.origin : 'https://wilkins.media';

const POSTERS = [
  {
    mode: 'directions',
    path: '/tap/directions?zone=stadium_gate_c',
    heading: 'Find Your Way',
    subline: 'Scan for instant directions to your gate, seat, or exit.',
    icon: 'DIR',
    accent: '#3B82F6',
  },
  {
    mode: 'food',
    path: '/tap/food',
    heading: 'Food & Drink',
    subline: 'Scan to discover nearby dining in your language.',
    icon: 'FOOD',
    accent: '#C9A84C',
  },
  {
    mode: 'rewards',
    path: '/tap/rewards',
    heading: 'Earn Rewards',
    subline: 'Scan to unlock badges, challenges, and exclusive perks.',
    icon: 'WIN',
    accent: '#FACC15',
  },
  {
    mode: 'help',
    path: '/tap/help',
    heading: 'Need Help?',
    subline: 'Scan for medical, security, or general assistance - any language.',
    icon: 'HELP',
    accent: '#EF4444',
  },
  {
    mode: 'vip',
    path: '/tap/vip',
    heading: 'VIP Experience',
    subline: 'Scan for premium access, lounges, and exclusive offers.',
    icon: 'VIP',
    accent: '#C026D3',
  },
] as const;

// --- Page ---------------------------------------------------------------------
export default function TapPostersPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Screen header (hidden in print) */}
      <div className="print:hidden mx-auto max-w-lg px-4 py-6 text-center">
        <h1 className="font-display text-xl font-bold text-brand-text">Tap FIFA QR Posters</h1>
        <p className="mt-1 text-sm text-brand-muted">
          5 print-ready posters. Use Ctrl+P / Cmd+P to print.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 rounded-xl bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-black transition-all hover:bg-brand-gold/90"
        >
          Print All Posters
        </button>
        <p className="mt-3 text-xs text-brand-muted">
          These are real scannable QR codes linked to your live Tap routes.
        </p>
      </div>

      {/* Poster cards - each is a print page */}
      <div className="flex flex-col items-center gap-8 px-4 pb-12 print:gap-0 print:px-0 print:pb-0">
        {POSTERS.map((poster) => {
          const url = `${mounted ? BASE_URL : 'https://wilkins.media'}${poster.path}`;
          return (
            <div
              key={poster.mode}
              className="w-full max-w-[420px] print:max-w-none print:w-full print:h-screen print:break-after-page"
            >
              <div
                className="flex flex-col items-center justify-center rounded-3xl border-2 p-8 print:rounded-none print:border-0 print:h-full print:p-16"
                style={{
                  borderColor: `${poster.accent}60`,
                  background: `linear-gradient(180deg, #0A0A0F 0%, ${poster.accent}08 50%, #0A0A0F 100%)`,
                }}
              >
                {/* Branding */}
                <div className="mb-6 text-center print:mb-10">
                  <p className="font-display text-sm font-bold tracking-tight text-brand-text print:text-lg">
                    Wilkins <span style={{ color: poster.accent }}>Media</span>
                  </p>
                  <p className="mt-0.5 text-2xs font-semibold uppercase tracking-widest text-brand-muted print:text-xs print:mt-1">
                    Tap FIFA - Atlanta 2026
                  </p>
                </div>

                {/* Icon */}
                <div
                  className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl text-lg font-black tracking-wide shadow-xl print:h-28 print:w-28 print:text-2xl print:mb-8"
                  style={{
                    backgroundColor: `${poster.accent}15`,
                    boxShadow: `0 8px 32px ${poster.accent}20`,
                  }}
                >
                  {poster.icon}
                </div>

                {/* Heading */}
                <h2
                  className="mb-2 font-display text-3xl font-bold text-center print:text-5xl print:mb-4"
                  style={{ color: poster.accent }}
                >
                  {poster.heading}
                </h2>

                {/* Subline */}
                <p className="mb-6 max-w-[280px] text-center text-sm text-brand-muted print:text-xl print:max-w-[400px] print:mb-10">
                  {poster.subline}
                </p>

                {/* Real QR code area */}
                {mounted && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-4">
                    <QRCodeSVG
                      value={url}
                      size={180}
                      bgColor="#FFFFFF"
                      fgColor="#0A0A0F"
                      level="M"
                    />
                  </div>
                )}

                {/* Scan CTA */}
                <p
                  className="mt-4 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest print:text-base print:mt-6 print:px-8 print:py-3"
                  style={{ backgroundColor: `${poster.accent}15`, color: poster.accent }}
                >
                  Scan to Start
                </p>

                {/* Phone fallback */}
                <p className="mt-4 text-xs text-brand-muted print:text-sm print:mt-6">
                  Or text <span className="font-semibold text-brand-text">HELP</span> to{' '}
                  <span className="font-semibold text-brand-text">1-888-827-3432</span>
                </p>

                {/* URL for reference */}
                <p className="mt-2 font-mono text-2xs text-brand-muted/60 break-all text-center print:text-xs print:mt-4">
                  {url}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          header,
          nav,
          .print\\:hidden {
            display: none !important;
          }

          @page {
            margin: 0;
            size: letter portrait;
          }
        }
      `}</style>
    </div>
  );
}
