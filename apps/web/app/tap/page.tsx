'use client';

import Link from 'next/link';
import { Navigation, Utensils, Trophy, ShieldAlert, Smartphone, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

// ─── Action Cards ─────────────────────────────────────────────────────────────

const ACTIONS = [
  {
    href: '/tap/directions',
    icon: Navigation,
    title: 'Directions',
    description: 'Route to stadium, gates, transit',
    gradient: 'from-blue-600/20 to-brand-surface',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    tag: 'Wayfinding',
  },
  {
    href: '/tap/food',
    icon: Utensils,
    title: 'Food & Drink',
    description: 'Halal, vegan, cultural dining nearby',
    gradient: 'from-amber-600/20 to-brand-surface',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    tag: 'Dining',
  },
  {
    href: '/tap/rewards',
    icon: Trophy,
    title: 'Rewards',
    description: 'Earn badges, unlock experiences',
    gradient: 'from-brand-gold/20 to-brand-surface',
    border: 'border-brand-gold/30',
    iconColor: 'text-brand-gold',
    tag: 'Passport',
  },
  {
    href: '/tap/help',
    icon: ShieldAlert,
    title: 'Emergency Help',
    description: 'Medical, lost child, police — instant',
    gradient: 'from-red-600/20 to-brand-surface',
    border: 'border-red-500/30',
    iconColor: 'text-red-400',
    tag: 'Safety',
  },
] as const;

// ─── Next Match ───────────────────────────────────────────────────────────────

const NEXT_MATCH = {
  teams: 'USA vs England',
  group: 'Group B · Match Day 2',
  date: 'June 19, 2026 · 8:00 PM ET',
  venue: 'Mercedes-Benz Stadium',
  attendance: '71,000',
};

// ─── Sponsor Offer ────────────────────────────────────────────────────────────

const SPONSOR = {
  name: 'Coca-Cola',
  offer: 'Free Coca-Cola at any Fan Zone',
  code: 'FIFATAP26',
  color: 'from-red-700/20 to-brand-surface',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TapLandingPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 animate-fade-in">
      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-gradient p-6 shadow-brand">
        {/* Decorative glow */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-brand-electric/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-3">
          {/* ── Text ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                Scan · Move · Experience
              </span>
            </div>

            <h1 className="mt-3 font-display text-4xl font-black tracking-tight text-white">
              TAP <span className="text-brand-gold">FIFA</span>
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              Your AI-powered guide to FIFA World Cup 2026.
              <br />
              <span className="text-brand-text font-medium">Atlanta · Mercedes-Benz Stadium</span>
            </p>

            <div className="mt-4 flex items-center gap-3">
              <a
                href="sms:+18888273432?body=FIFA"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-bold text-brand-black shadow-brand transition-all hover:bg-brand-gold-light active:scale-[0.97]"
              >
                <Smartphone className="h-4 w-4" />
                Text FIFA
              </a>
              <a
                href="tel:+18888273432"
                className="inline-flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-4 py-2.5 text-sm font-medium text-brand-text transition-all hover:border-brand-gold/50"
              >
                Call FIFA
              </a>
            </div>
          </div>

          {/* ── QR Code ─────────────────────────────────────── */}
          <div className="shrink-0 flex flex-col items-center gap-1.5">
            <div className="rounded-xl bg-white p-2 shadow-lg">
              <QRCodeSVG
                value="sms:+18888273432?body=FIFA"
                size={96}
                bgColor="#FFFFFF"
                fgColor="#0A0A0F"
                level="M"
              />
            </div>
            <span className="text-2xs font-semibold text-brand-gold">Scan to start</span>
          </div>
        </div>
      </div>

      {/* ── Next Match Card ─────────────────────────────────── */}
      <div className="mb-6 rounded-2xl border border-brand-border bg-brand-surface p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xs font-semibold uppercase tracking-widest text-brand-electric">
            Next Match
          </span>
          <span className="h-2 w-2 rounded-full bg-brand-success animate-pulse" />
        </div>
        <p className="font-display text-xl font-bold text-white">{NEXT_MATCH.teams}</p>
        <p className="mt-0.5 text-xs text-brand-muted">{NEXT_MATCH.group}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-brand-muted">
          <span>{NEXT_MATCH.date}</span>
          <span>{NEXT_MATCH.venue}</span>
        </div>
      </div>

      {/* ── Action Grid ─────────────────────────────────────── */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
        What do you need?
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <div
                className={`group relative flex flex-col rounded-2xl border ${action.border} bg-gradient-to-br ${action.gradient} p-4 transition-all duration-200 hover:shadow-brand hover:-translate-y-0.5 active:scale-[0.97]`}
              >
                <span className="mb-1 text-2xs font-semibold uppercase tracking-wider text-brand-muted">
                  {action.tag}
                </span>
                <Icon className={`mt-1 h-7 w-7 ${action.iconColor}`} />
                <p className="mt-2 font-display text-base font-bold text-white leading-tight">
                  {action.title}
                </p>
                <p className="mt-1 text-2xs text-brand-muted leading-snug">
                  {action.description}
                </p>
                <ArrowRight className="absolute bottom-3 right-3 h-4 w-4 text-brand-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Poster Mockup ───────────────────────────────────── */}
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-muted">
          The physical entry point
        </p>
        <div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-gradient-to-b from-brand-navy to-brand-black p-6 text-center">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          />
          <div className="relative">
            <div className="mb-3 inline-block rounded-full border border-brand-gold/40 px-3 py-0.5">
              <span className="text-2xs font-bold uppercase tracking-widest text-brand-gold">
                FIFA World Cup 2026 · Atlanta
              </span>
            </div>

            <div className="mx-auto mb-3 w-fit rounded-xl bg-white p-3 shadow-xl ring-1 ring-brand-gold/20">
              <QRCodeSVG
                value="sms:+18888273432?body=FIFA"
                size={128}
                bgColor="#FFFFFF"
                fgColor="#0A0A0F"
                level="M"
              />
            </div>

            <p className="font-display text-3xl font-black tracking-tight text-white">
              TAP <span className="text-brand-gold">FIFA</span>
            </p>
            <p className="mt-1 text-sm font-medium text-brand-muted">Scan. Move. Experience.</p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2">
              <Smartphone className="h-4 w-4 text-brand-gold" />
              <span className="font-mono text-sm font-bold text-brand-gold">1-888-827-3432</span>
            </div>
            <p className="mt-2 text-2xs text-brand-muted/60">Text FIFA · Tap FIFA · Call FIFA</p>
          </div>
        </div>
      </div>

      {/* ── Sponsor Offer ───────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/40 via-brand-surface to-brand-surface p-4">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-600/10 blur-2xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-red-500/20 px-2 py-0.5 text-2xs font-bold uppercase tracking-wider text-red-400">
                Official Partner
              </span>
              <span className="rounded bg-brand-gold/20 px-2 py-0.5 text-2xs font-bold uppercase tracking-wider text-brand-gold">
                Live Offer
              </span>
            </div>
            <p className="font-display text-base font-bold text-white leading-tight">{SPONSOR.offer}</p>
            <p className="mt-0.5 text-xs text-brand-muted">
              Code: <span className="font-mono font-bold text-brand-gold">{SPONSOR.code}</span>
            </p>
            <a
              href={`sms:+18888273432?body=${SPONSOR.code}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-red-500 active:scale-[0.97]"
            >
              <Smartphone className="h-3.5 w-3.5" />
              Claim via Text
            </a>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-950/40 text-4xl">
            🥤
          </div>
        </div>
      </div>

      {/* ── CTA footer ──────────────────────────────────────── */}
      <div className="mt-8 text-center">
        <p className="text-xs text-brand-muted">
          Powered by <span className="font-semibold text-brand-text">Wilkins Media</span>
        </p>
        <p className="mt-1 text-2xs text-brand-muted/60">
          The Global Guest Operating System for FIFA-Scale Events
        </p>
      </div>
    </div>
  );
}
