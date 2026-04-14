'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, ShieldAlert, Volume2, ChevronRight, Shield, MessageCircle } from 'lucide-react';

// ─── Emergency Phrases ────────────────────────────────────────────────────────

const PHRASES = [
  { key: 'need_hospital', emoji: '🏥', en: 'I need a hospital', urgency: 'CRITICAL' as const },
  { key: 'lost_child', emoji: '👦', en: 'I lost my child', urgency: 'CRITICAL' as const },
  { key: 'need_medical', emoji: '🩺', en: 'I need medical help', urgency: 'CRITICAL' as const },
  { key: 'need_police', emoji: '🚔', en: 'I need police', urgency: 'HIGH' as const },
  { key: 'i_am_lost', emoji: '📍', en: 'I am lost', urgency: 'HIGH' as const },
  { key: 'lost_passport', emoji: '📄', en: 'I lost my passport', urgency: 'HIGH' as const },
  { key: 'need_transport', emoji: '🚗', en: 'I need transportation', urgency: 'MEDIUM' as const },
  { key: 'need_translation', emoji: '🗣️', en: 'I need translation help', urgency: 'MEDIUM' as const },
] as const;

const URGENCY_STYLE = {
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
} as const;

// ─── Quick Contacts ───────────────────────────────────────────────────────────

const CONTACTS = [
  { label: '911 Emergency', phone: '911', icon: '🚨' },
  { label: 'FIFA Helpline', phone: '+18888273432', icon: '⚽' },
  { label: 'Stadium Security', phone: '+14045551000', icon: '🏟️' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950/30 via-brand-black to-brand-black animate-fade-in">
      <div className="mx-auto max-w-lg px-4 py-6">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-6">
          <Link href="/tap" className="mb-3 inline-flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>

          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 border-2 border-red-500 shadow-lg shadow-red-500/20">
              <ShieldAlert className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="font-display text-3xl font-black text-white">Emergency Help</h1>
            <p className="mt-2 text-sm text-white/60">
              Tap a phrase — show your phone to any staff member
            </p>
          </div>
        </div>

        {/* ── 911 Call Button ─────────────────────────────── */}
        <a
          href="tel:911"
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-red-600 py-4 text-lg font-black text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 active:scale-[0.98]"
        >
          <Phone className="h-6 w-6" />
          CALL 911
        </a>

        {/* ── Text/Call FIFA ──────────────────────────────── */}
        <div className="mb-6 grid grid-cols-2 gap-2">
          <a
            href="sms:+18888273432?body=HELP"
            className="flex items-center justify-center gap-2 rounded-xl border border-brand-gold/40 bg-brand-gold/10 py-3 text-sm font-bold text-brand-gold transition-all hover:bg-brand-gold/20 active:scale-[0.97]"
          >
            <MessageCircle className="h-4 w-4" />
            Text HELP
          </a>
          <a
            href="tel:+18888273432"
            className="flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-surface py-3 text-sm font-semibold text-brand-text transition-all hover:border-brand-gold/50 active:scale-[0.97]"
          >
            <Phone className="h-4 w-4" />
            Call FIFA
          </a>
        </div>

        {/* ── Emergency Phrase Cards ──────────────────────── */}
        <div className="flex flex-col gap-3 mb-6">
          {PHRASES.map((phrase) => {
            const s = URGENCY_STYLE[phrase.urgency];
            return (
              <Link key={phrase.key} href={`/event/emergency/${phrase.key}`}>
                <div className={`flex items-center gap-4 rounded-xl border-2 ${s.border} ${s.bg} ${s.hover} p-4 transition-all active:scale-[0.98]`}>
                  <span className="text-3xl">{phrase.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg font-bold text-white">{phrase.en}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      <span className={`text-2xs font-semibold uppercase tracking-wider ${s.label}`}>
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

        {/* ── Quick Contacts ──────────────────────────────── */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Quick Contacts
        </p>
        <div className="flex flex-col gap-2 mb-6">
          {CONTACTS.map((c) => (
            <a
              key={c.phone}
              href={`tel:${c.phone}`}
              className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface/50 p-3 transition-all hover:border-brand-gold/30 active:scale-[0.98]"
            >
              <span className="text-lg">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{c.label}</p>
              </div>
              <Phone className="h-4 w-4 text-brand-muted" />
            </a>
          ))}
        </div>

        {/* ── Safety Notice ───────────────────────────────── */}
        <div className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-surface/30 p-4">
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

        {/* ── Back to safety ──────────────────────────────── */}
        <div className="mt-6 rounded-2xl border border-brand-border bg-brand-surface/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-2">
            You&#39;re safe
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/tap/directions" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
              <span className="text-sm text-brand-text">🗺️ Navigate to nearest exit</span>
              <ChevronRight className="h-4 w-4 text-brand-muted" />
            </Link>
            <Link href="/tap" className="flex items-center justify-between rounded-lg p-2 hover:bg-brand-surface/50 transition-colors">
              <span className="text-sm text-brand-text">🏠 Return to TAP FIFA home</span>
              <ChevronRight className="h-4 w-4 text-brand-muted" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
