'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Card, CardContent, Badge } from '@wilkins/ui';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURED_SERVICES = [
  { id: '1', name: 'Al-Noor Halal Grill', cuisine: 'MIDDLE_EASTERN', dietary: ['HALAL'], distance: '0.4 km', rating: 4.7, priceRange: 2, isOpen: true },
  { id: '2', name: 'Casa de México', cuisine: 'LATIN_AMERICAN', dietary: ['VEGETARIAN'], distance: '0.7 km', rating: 4.5, priceRange: 2, isOpen: true },
  { id: '3', name: 'Seoul Garden', cuisine: 'EAST_ASIAN', dietary: ['VEGAN'], distance: '0.6 km', rating: 4.6, priceRange: 2, isOpen: false },
  { id: '4', name: 'Mumbai Bites', cuisine: 'SOUTH_ASIAN', dietary: ['VEGETARIAN', 'HALAL'], distance: '1.1 km', rating: 4.8, priceRange: 2, isOpen: true },
  { id: '5', name: 'Lagos Kitchen', cuisine: 'WEST_AFRICAN', dietary: ['HALAL'], distance: '0.9 km', rating: 4.4, priceRange: 1, isOpen: true },
  { id: '6', name: 'Le Petit Bistro', cuisine: 'EUROPEAN', dietary: [], distance: '0.5 km', rating: 4.3, priceRange: 3, isOpen: true },
];

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: '🥩 Halal', value: 'HALAL' },
  { label: '🥦 Vegetarian', value: 'VEGETARIAN' },
  { label: '🌱 Vegan', value: 'VEGAN' },
  { label: '🟢 Open Now', value: 'open' },
];

const CUISINE_META: Record<string, { label: string; emoji: string }> = {
  MIDDLE_EASTERN: { label: 'Middle Eastern', emoji: '🥙' },
  LATIN_AMERICAN: { label: 'Latin American', emoji: '🌮' },
  EAST_ASIAN:     { label: 'East Asian',     emoji: '🍜' },
  SOUTH_ASIAN:    { label: 'South Asian',    emoji: '🍛' },
  WEST_AFRICAN:   { label: 'West African',   emoji: '🍲' },
  EUROPEAN:        { label: 'European',       emoji: '🥐' },
  CARIBBEAN:       { label: 'Caribbean',      emoji: '🏝️' },
};

const PRICE_DOTS = (n: number) => '●'.repeat(n) + '○'.repeat(3 - n);

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConciergePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    return FEATURED_SERVICES.filter((s) => {
      if (activeFilter === 'open') return s.isOpen;
      if (activeFilter !== 'all' && !s.dietary.includes(activeFilter)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const meta = CUISINE_META[s.cuisine];
        return (
          s.name.toLowerCase().includes(q) ||
          (meta?.label ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeFilter, query]);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-brand-text">Cultural Concierge</h1>
        <p className="mt-1 text-sm text-brand-muted">Food and services that feel like home</p>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cuisine, restaurant…"
          className="w-full rounded-xl border border-brand-border bg-brand-surface pl-10 pr-4 py-3 text-sm text-brand-text placeholder:text-brand-muted focus:border-brand-gold focus:outline-none transition-colors"
        />
      </div>

      {/* Filter pills */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              activeFilter === f.value
                ? 'border-brand-gold bg-brand-gold/10 text-brand-gold shadow-sm shadow-brand-gold/20'
                : 'border-brand-border bg-brand-surface text-brand-muted hover:border-brand-gold/60 hover:text-brand-text'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="mb-3 text-xs text-brand-muted">
        {visible.length} result{visible.length !== 1 ? 's' : ''}
        {activeFilter !== 'all' && <span className="text-brand-gold"> · filtered</span>}
      </p>

      {/* Results */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl mb-3">🔍</span>
          <p className="text-sm font-medium text-brand-text">No matches found</p>
          <p className="text-xs text-brand-muted mt-1">Try a different filter or search term</p>
          <button
            onClick={() => { setActiveFilter('all'); setQuery(''); }}
            className="mt-4 text-xs text-brand-gold underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((service) => {
            const meta = CUISINE_META[service.cuisine] ?? { label: service.cuisine, emoji: '🍽️' };
            return (
              <Card
                key={service.id}
                variant="elevated"
                className="group cursor-pointer hover:border-brand-gold/50 hover:-translate-y-0.5 hover:shadow-brand transition-all duration-200"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-slate text-2xl transition-transform duration-200 group-hover:scale-110">
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-brand-text truncate group-hover:text-white transition-colors">
                      {service.name}
                    </p>
                    <p className="text-xs text-brand-muted mt-0.5">
                      {meta.label} · {service.distance} · <span className="font-mono text-brand-gold/70">{PRICE_DOTS(service.priceRange)}</span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {service.dietary.map((d) => (
                        <Badge key={d} variant="success" className="text-2xs">{d}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <p className="text-xs font-medium text-brand-gold">★ {service.rating}</p>
                    <Badge variant={service.isOpen ? 'success' : 'outline'}>
                      {service.isOpen ? 'Open' : 'Closed'}
                    </Badge>
                    <ChevronRight className="h-3.5 w-3.5 text-brand-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
