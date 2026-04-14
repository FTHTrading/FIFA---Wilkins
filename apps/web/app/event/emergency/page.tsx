'use client';

import Link from 'next/link';
import { Phone, Volume2, AlertTriangle, Shield } from 'lucide-react';

const EMERGENCY_PHRASES = [
  { key: 'need_hospital', emoji: '🏥', en: 'I need a hospital', urgency: 'CRITICAL' as const },
  { key: 'lost_child', emoji: '👦', en: 'I lost my child', urgency: 'CRITICAL' as const },
  { key: 'need_medical', emoji: '🩺', en: 'I need medical help', urgency: 'CRITICAL' as const },
  { key: 'need_police', emoji: '🚔', en: 'I need police', urgency: 'HIGH' as const },
  { key: 'i_am_lost', emoji: '📍', en: 'I am lost', urgency: 'HIGH' as const },
  { key: 'lost_passport', emoji: '📄', en: 'I lost my passport', urgency: 'HIGH' as const },
  { key: 'need_transport', emoji: '🚗', en: 'I need transportation', urgency: 'MEDIUM' as const },
  { key: 'need_translation', emoji: '🗣️', en: 'I need translation help', urgency: 'MEDIUM' as const },
] as const;

const urgencyStyles = {
  CRITICAL: {
    border: 'border-red-500',
    bg: 'bg-red-950/60',
    hover: 'hover:bg-red-900/60',
    dot: 'bg-red-500 animate-pulse',
    label: 'text-red-400',
  },
  HIGH: {
    border: 'border-orange-500/70',
    bg: 'bg-orange-950/40',
    hover: 'hover:bg-orange-900/40',
    dot: 'bg-orange-500',
    label: 'text-orange-400',
  },
  MEDIUM: {
    border: 'border-amber-500/50',
    bg: 'bg-amber-950/30',
    hover: 'hover:bg-amber-900/30',
    dot: 'bg-amber-500',
    label: 'text-amber-400',
  },
};

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950/30 via-brand-black to-brand-black">
      <div className="mx-auto max-w-lg px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 border-2 border-red-500 shadow-lg shadow-red-500/20">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="font-display text-3xl font-black text-white">Emergency Help</h1>
          <p className="mt-2 text-sm text-white/60">
            Tap a phrase — show your phone to any staff member
          </p>
        </div>

        {/* 911 call */}
        <a
          href="tel:911"
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 text-lg font-black text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 active:scale-[0.98]"
        >
          <Phone className="h-6 w-6" />
          CALL 911
        </a>

        {/* Phrase grid — critical first */}
        <div className="flex flex-col gap-3">
          {EMERGENCY_PHRASES.map((phrase) => {
            const style = urgencyStyles[phrase.urgency];
            return (
              <Link key={phrase.key} href={`/event/emergency/${phrase.key}`}>
                <div
                  className={`flex items-center gap-4 rounded-xl border-2 ${style.border} ${style.bg} ${style.hover} p-4 transition-all active:scale-[0.98]`}
                >
                  <span className="text-3xl">{phrase.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg font-bold text-white">{phrase.en}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                      <span className={`text-2xs font-semibold uppercase tracking-wider ${style.label}`}>
                        {phrase.urgency}
                      </span>
                    </div>
                  </div>
                  <Volume2 className="h-5 w-5 shrink-0 text-white/40" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Safety footer */}
        <div className="mt-8 flex items-center gap-3 rounded-xl bg-brand-surface/50 border border-brand-border p-4">
          <Shield className="h-5 w-5 shrink-0 text-brand-gold" />
          <div>
            <p className="text-xs font-medium text-brand-text">
              All translations are pre-approved by professional translators.
            </p>
            <p className="text-xs text-brand-muted mt-0.5">
              Not AI-generated. Verified for emergency accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
