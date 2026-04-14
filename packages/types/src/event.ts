// ─── Organizations (multi-tenant) ────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Events ──────────────────────────────────────────────────────────────────

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface Event {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  startDate: string;
  endDate: string;
  timeZone: string;
  city: string;
  country: string;
  status: EventStatus;
  defaultLanguage: string;
  supportedLanguages: string[];
  bannerUrl?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Venues ──────────────────────────────────────────────────────────────────

export type VenueType = 'STADIUM' | 'CONVENTION_CENTER' | 'ARENA' | 'OUTDOOR' | 'CITY_DISTRICT' | 'OTHER';

export interface Venue {
  id: string;
  eventId: string;
  organizationId: string;
  name: string;
  type: VenueType;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  mapboxVenueId?: string;
  indoorMapUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Points of Interest ───────────────────────────────────────────────────────

export type POICategory =
  | 'GATE'
  | 'RESTROOM'
  | 'FIRST_AID'
  | 'CONCESSION'
  | 'MERCHANDISE'
  | 'SEATING'
  | 'ACCESSIBILITY'
  | 'EXIT'
  | 'HELP_DESK'
  | 'TRANSPORT'
  | 'PARKING'
  | 'PRAYER_ROOM'
  | 'FAMILY_AREA'
  | 'VIP'
  | 'OTHER';

export interface VenuePOI {
  id: string;
  venueId: string;
  category: POICategory;
  nameKey: string;         // i18n key for display name
  descriptionKey?: string; // i18n key for description
  latitude?: number;
  longitude?: number;
  floor?: string;
  zone?: string;
  section?: string;
  isAccessible: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Match Days / Activation Days ────────────────────────────────────────────

export interface EventDay {
  id: string;
  eventId: string;
  venueId: string;
  date: string;
  label: string;
  description?: string;
  isMatchDay: boolean;
  teams?: string[];
}
