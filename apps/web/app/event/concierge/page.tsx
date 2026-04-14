import type { Metadata } from 'next';
import { Search, Filter } from 'lucide-react';
import { Input, Card, CardContent, Badge } from '@wilkins/ui';

export const metadata: Metadata = { title: 'Cultural Concierge' };

// Mock concierge data (Atlanta-seeded, replaced by real API in Phase 2)
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
  { label: 'Halal', value: 'HALAL' },
  { label: 'Vegetarian', value: 'VEGETARIAN' },
  { label: 'Vegan', value: 'VEGAN' },
  { label: 'Open Now', value: 'open' },
];

const CUISINE_LABELS: Record<string, string> = {
  MIDDLE_EASTERN: 'Middle Eastern',
  LATIN_AMERICAN: 'Latin American',
  EAST_ASIAN: 'East Asian',
  SOUTH_ASIAN: 'South Asian',
  WEST_AFRICAN: 'West African',
  EUROPEAN: 'European',
  CARIBBEAN: 'Caribbean',
};

export default function ConciergePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-text">Cultural Concierge</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Find food and services that feel like home
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search cuisine, restaurant, service…"
          startIcon={<Search className="h-4 w-4" />}
          className="bg-brand-slate"
        />
      </div>

      {/* Filter chips */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className="shrink-0 rounded-full border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-medium text-brand-muted transition-all hover:border-brand-gold hover:text-brand-gold"
          >
            {f.label}
          </button>
        ))}
        <button className="shrink-0 rounded-full border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-medium text-brand-muted hover:border-brand-gold">
          <Filter className="h-3 w-3 inline mr-1" />
          More filters
        </button>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3">
        {FEATURED_SERVICES.map((service) => (
          <Card key={service.id} variant="elevated" className="cursor-pointer hover:border-brand-gold/50 transition-all">
            <CardContent className="flex items-center gap-4 p-4">
              {/* Cuisine icon placeholder */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-slate text-2xl">
                🍽️
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-brand-text truncate">
                  {service.name}
                </p>
                <p className="text-xs text-brand-muted">
                  {CUISINE_LABELS[service.cuisine] ?? service.cuisine} · {service.distance}
                </p>
                {/* Dietary badges */}
                <div className="mt-1 flex flex-wrap gap-1">
                  {service.dietary.map((d) => (
                    <Badge key={d} variant="success" className="text-2xs">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium text-brand-gold">★ {service.rating}</p>
                <Badge variant={service.isOpen ? 'success' : 'outline'} className="mt-1">
                  {service.isOpen ? 'Open' : 'Closed'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
