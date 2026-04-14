'use client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ─── Concierge ────────────────────────────────────────────────────────────────

export interface ConciergeParams {
  q: string;
  lang: string;
  venueId: string;
  eventId?: string;
  lat?: number;
  lng?: number;
}

export interface ParsedIntent {
  intent: string;
  confidence: number;
  venueCategory?: string;
  culturalContext?: string;
  rawQuery: string;
}

export interface SponsorRec {
  id: string;
  name: string;
  sponsorName: string;
  ctaText?: string;
  ctaUrl?: string;
  badge: string;
  reason: string;
  priorityScore: number;
}

export interface GeoResult {
  placeId: string;
  placeName: string;
  latitude: number;
  longitude: number;
  category?: string;
  relevance: number;
}

export interface VenuePoi {
  id: string;
  name: string;
  localizedName?: string;
  category: string;
  latitude: number;
  longitude: number;
  floor?: string;
  isActive?: boolean;
  isSponsored?: boolean;
}

export interface ConciergeResponse {
  intent: ParsedIntent;
  venuePois: VenuePoi[];
  nearbyAmenities: Array<{ id: number; name: string; latitude: number; longitude: number; type: string }>;
  geocoding: GeoResult[];
  sponsorRecommendations: SponsorRec[];
  explanation: string;
}

export function fetchConcierge(params: ConciergeParams): Promise<ConciergeResponse> {
  const qs = new URLSearchParams();
  qs.set('q', params.q);
  qs.set('lang', params.lang);
  qs.set('venueId', params.venueId);
  if (params.eventId) qs.set('eventId', params.eventId);
  if (params.lat != null) qs.set('lat', String(params.lat));
  if (params.lng != null) qs.set('lng', String(params.lng));
  return apiFetch<ConciergeResponse>(`/agentic/concierge-assist?${qs}`);
}

// ─── Emergency ────────────────────────────────────────────────────────────────

export interface EmergencyOption {
  type: string;
  label: string;
  english: string;
  action: string;
}

export function fetchEmergencyOptions(lang: string): Promise<EmergencyOption[]> {
  return apiFetch<EmergencyOption[]>(`/emergency/options?lang=${encodeURIComponent(lang)}`);
}

export function reportEmergencyIncident(body: {
  sessionId: string;
  phraseKey: string;
  language: string;
  eventId?: string;
  venueId?: string;
}): Promise<unknown> {
  return apiFetch('/emergency/incidents', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

export function fetchVenuePois(venueId: string, lang: string, category?: string): Promise<VenuePoi[]> {
  const qs = new URLSearchParams({ lang });
  if (category && category !== 'ALL') qs.set('category', category);
  return apiFetch<VenuePoi[]>(`/maps/venues/${encodeURIComponent(venueId)}/pois?${qs}`);
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  sponsorName: string;
  sponsorLogoUrl?: string;
  title: string;
  bodyText?: string;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  placementType: string;
  impressions: number;
  clicks: number;
}

export function fetchCampaigns(eventId: string, placement?: string, lang?: string): Promise<Campaign[]> {
  const qs = new URLSearchParams({ eventId });
  if (placement) qs.set('placement', placement);
  if (lang) qs.set('lang', lang);
  return apiFetch<Campaign[]>(`/campaigns?${qs}`);
}

export function recordImpression(campaignId: string): Promise<void> {
  return apiFetch(`/campaigns/${encodeURIComponent(campaignId)}/impression`, { method: 'POST' });
}

export function recordClick(campaignId: string): Promise<void> {
  return apiFetch(`/campaigns/${encodeURIComponent(campaignId)}/click`, { method: 'POST' });
}

// ─── Rewards & Badges ─────────────────────────────────────────────────────────

export interface RewardBadge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  pointsValue: number;
  requirement: string;
  totalClaimed: number;
  maxClaims: number | null;
  isActive: boolean;
  expiresAt?: string;
}

export interface ApiChallenge {
  id: string;
  name: string;
  description: string;
  type: string;
  rewardPoints: number;
  couponCode?: string;
  couponValue?: string;
  status: string;
}

export interface SessionRewards {
  sessionId: string;
  eventId: string;
  totalPoints: number;
  badges: Array<{ id: string; name: string; icon: string; tier: string }>;
}

export interface ClaimResult {
  claimed: boolean;
  reason?: string;
  claim?: Record<string, unknown>;
  badge?: RewardBadge;
}

export interface CouponResult {
  redeemed: boolean;
  reason?: string;
  redemption?: Record<string, unknown>;
}

export function fetchBadges(eventId: string): Promise<RewardBadge[]> {
  return apiFetch<RewardBadge[]>(`/campaigns/badges?eventId=${encodeURIComponent(eventId)}`);
}

export function claimBadge(badgeId: string, sessionId: string, eventId: string): Promise<ClaimResult> {
  return apiFetch<ClaimResult>(`/campaigns/badges/${encodeURIComponent(badgeId)}/claim`, {
    method: 'POST',
    body: JSON.stringify({ sessionId, eventId }),
  });
}

export function fetchSessionRewards(sessionId: string, eventId: string): Promise<SessionRewards> {
  return apiFetch<SessionRewards>(
    `/campaigns/rewards/session?sessionId=${encodeURIComponent(sessionId)}&eventId=${encodeURIComponent(eventId)}`,
  );
}

export function fetchChallenges(eventId: string): Promise<ApiChallenge[]> {
  return apiFetch<ApiChallenge[]>(`/campaigns/challenges?eventId=${encodeURIComponent(eventId)}`);
}

export function redeemCoupon(body: {
  sessionId: string;
  eventId: string;
  couponCode: string;
  campaignId?: string;
  challengeId?: string;
}): Promise<CouponResult> {
  return apiFetch<CouponResult>('/campaigns/coupons/redeem', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface VenueAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  body: string;
  postedAt: string;
  source?: string;
  eventId: string;
}

export function fetchAlerts(eventSlug: string): Promise<VenueAlert[]> {
  return apiFetch<VenueAlert[]>(`/events/${encodeURIComponent(eventSlug)}/alerts`);
}
