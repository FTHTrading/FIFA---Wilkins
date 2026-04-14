/**
 * @wilkins/agentic — MCP Tool Interfaces for Atlanta World Cup Intelligence
 *
 * These tool interfaces define the contract for the MCP-driven agentic RAG system.
 * Each tool can be invoked by the orchestrator with typed parameters and returns
 * structured results with trace metadata.
 */

// ─── Common Types ───────────────────────────────────────────────────────────

export interface ToolInvocation<TParams, TResult> {
  tool: string;
  params: TParams;
  result: TResult;
  durationMs: number;
  source: string;
  confidence: number;
  cached: boolean;
}

export interface SourceMeta {
  sourceId: string;
  sourceType: 'official-fifa' | 'venue' | 'city' | 'transit' | 'internal' | 'hospitality' | 'community';
  freshnessScore: number;
  lastUpdated: string;
  url?: string;
}

// ─── Match Schedule ─────────────────────────────────────────────────────────

export interface MatchScheduleParams {
  matchId?: string;
  date?: string;
  stage?: 'GS' | 'R32' | 'R16' | 'QF' | 'SF' | 'F';
  teamCode?: string;
  confirmed?: boolean;
}

export interface MatchScheduleResult {
  matches: Array<{
    id: string;
    date: string;
    kickoff: string;
    stage: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamCode: string;
    awayTeamCode: string;
    confirmed: boolean;
    audienceProfile: {
      primaryLanguages: string[];
      estimatedAttendance: number;
      premiumDemand: string;
    };
  }>;
  source: SourceMeta;
}

// ─── Team Profile ───────────────────────────────────────────────────────────

export interface TeamProfileParams {
  teamCode: string;
  includeRecommendations?: boolean;
  language?: string;
}

export interface TeamProfileResult {
  name: string;
  flag: string;
  languages: string[];
  culturalProfile: {
    cuisineAffinities: string[];
    dietaryNotes: string[];
    hospitalityStyle: string;
    nightlifeAffinity: string;
    premiumAffinity: string;
    familyFocus: string;
    transportPreference: string;
  };
  localRecommendations?: {
    restaurants: string[];
    neighborhoods: string[];
    culturalVenues: string[];
  };
  source: SourceMeta;
}

// ─── Sponsor Rights ─────────────────────────────────────────────────────────

export interface SponsorRightsParams {
  category?: string;
  rightsSensitive?: boolean;
  language?: string;
  matchId?: string;
}

export interface SponsorRightsResult {
  officialPartners: Array<{ name: string; category: string; rightsSensitive: true }>;
  localActivationCategories: string[];
  rightsBoundary: string;
  source: SourceMeta;
}

// ─── Venue POI ──────────────────────────────────────────────────────────────

export interface VenuePoiParams {
  category?: string;
  floor?: string;
  language?: string;
  accessible?: boolean;
  query?: string;
}

export interface VenuePoiResult {
  pois: Array<{
    name: string;
    nameI18n?: Record<string, string>;
    category: string;
    latitude: number;
    longitude: number;
    floor?: string;
    distanceM?: number;
  }>;
  source: SourceMeta;
}

// ─── City POI ───────────────────────────────────────────────────────────────

export interface CityPoiParams {
  category?: string;
  neighborhood?: string;
  language?: string;
  cuisineType?: string;
  query?: string;
}

export interface CityPoiResult {
  pois: Array<{
    name: string;
    category: string;
    address: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
    culturalRelevance: number;
  }>;
  source: SourceMeta;
}

// ─── Hospitality ────────────────────────────────────────────────────────────

export interface HospitalityParams {
  matchId?: string;
  tier?: 'standard' | 'premium' | 'vip' | 'suite';
  teamCode?: string;
  language?: string;
}

export interface HospitalityResult {
  packages: Array<{
    name: string;
    tier: string;
    price?: string;
    features: string[];
    availability: string;
    rightsSensitive: boolean;
  }>;
  source: SourceMeta;
}

// ─── Restaurant & Reservation ───────────────────────────────────────────────

export interface RestaurantParams {
  cuisineType?: string;
  teamCode?: string;
  language?: string;
  neighborhood?: string;
  dietary?: string[];
  priceRange?: string;
}

export interface RestaurantResult {
  restaurants: Array<{
    name: string;
    cuisine: string;
    neighborhood: string;
    address: string;
    priceRange: string;
    culturalMatch: number;
    dietaryOptions: string[];
    reservationUrl?: string;
  }>;
  source: SourceMeta;
}

// ─── Airport & Transit ─────────────────────────────────────────────────────

export interface AirportTransitParams {
  origin?: 'airport' | 'marta' | 'rideshare' | 'parking';
  destination?: 'stadium' | 'fan-festival' | 'hotel' | 'downtown';
  matchDay?: boolean;
  language?: string;
}

export interface AirportTransitResult {
  routes: Array<{
    mode: string;
    from: string;
    to: string;
    estimatedMinutes: number;
    cost?: string;
    matchDayNotes?: string;
    directions: string[];
  }>;
  source: SourceMeta;
}

// ─── Fan Festival ───────────────────────────────────────────────────────────

export interface FanFestivalParams {
  date?: string;
  matchId?: string;
  activityType?: string;
}

export interface FanFestivalResult {
  name: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
  activities: Array<{
    name: string;
    type: string;
    schedule?: string;
    sponsorActivation?: boolean;
  }>;
  source: SourceMeta;
}

// ─── Emergency Phrase ───────────────────────────────────────────────────────

export interface EmergencyPhraseParams {
  language: string;
  urgency?: 'critical' | 'high' | 'medium' | 'low';
  phraseKey?: string;
}

export interface EmergencyPhraseResult {
  phrases: Array<{
    phraseKey: string;
    urgency: string;
    icon: string;
    text: string;
    originalText: string;
  }>;
  deterministic: true;
  source: SourceMeta;
}

// ─── Multilingual Intent Classifier ─────────────────────────────────────────

export interface IntentClassifierParams {
  query: string;
  language: string;
  matchContext?: string;
  location?: { latitude: number; longitude: number };
}

export interface IntentClassifierResult {
  intent: string;
  confidence: number;
  subIntents: string[];
  suggestedTools: string[];
  safetyOverride: boolean;
}

// ─── Cultural Recommendation ────────────────────────────────────────────────

export interface CulturalRecommendationParams {
  teamCode?: string;
  language: string;
  intent: string;
  matchId?: string;
  location?: { latitude: number; longitude: number };
}

export interface CulturalRecommendationResult {
  recommendations: Array<{
    type: string;
    name: string;
    reason: string;
    culturalScore: number;
    sponsorEligible: boolean;
  }>;
  audienceInsights: {
    expectedLanguageMix: Record<string, number>;
    hospitalityDemand: string;
    cuisineDemand: string[];
  };
}

// ─── Sponsor Injection ──────────────────────────────────────────────────────

export interface SponsorInjectionParams {
  intent: string;
  language: string;
  matchId?: string;
  teamCode?: string;
  locationZone?: string;
}

export interface SponsorInjectionResult {
  eligibleCampaigns: Array<{
    campaignId: string;
    name: string;
    tier: string;
    rightsSensitive: boolean;
    placement: string;
    creativeLang: string;
    score: number;
  }>;
  safetyBlocked: boolean;
}

// ─── Rewards & Passport ─────────────────────────────────────────────────────

export interface RewardsParams {
  guestId?: string;
  matchId?: string;
  action?: 'check-in' | 'challenge' | 'redemption' | 'status';
}

export interface RewardsResult {
  points: number;
  badges: Array<{ name: string; tier: string; earned: boolean }>;
  activeChallenges: Array<{ name: string; progress: number; reward: string }>;
  availableCoupons: Array<{ sponsor: string; offer: string; expiresAt: string }>;
}

// ─── Revenue Analytics ──────────────────────────────────────────────────────

export interface RevenueAnalyticsParams {
  matchId?: string;
  dateRange?: { from: string; to: string };
  groupBy?: 'language' | 'intent' | 'zone' | 'campaign' | 'team';
}

export interface RevenueAnalyticsResult {
  totalRevenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  breakdown: Array<{
    key: string;
    revenue: number;
    impressions: number;
    ctr: number;
  }>;
}

// ─── Tool Registry ──────────────────────────────────────────────────────────

export const MCP_TOOLS = [
  'matchScheduleLookup',
  'teamProfileLookup',
  'sponsorRightsLookup',
  'venuePoiLookup',
  'cityPoiLookup',
  'hospitalityLookup',
  'restaurantAndReservationLookup',
  'airportTransitLookup',
  'fanFestivalLookup',
  'emergencyPhraseLookup',
  'multilingualIntentClassifier',
  'culturalRecommendationEngine',
  'sponsorInjectionEngine',
  'rewardsAndPassportLookup',
  'revenueAnalyticsLookup',
] as const;

export type MCPToolName = (typeof MCP_TOOLS)[number];

// ─── RAG Source Adapters ────────────────────────────────────────────────────

export interface RAGSourceAdapter {
  sourceId: string;
  sourceType: SourceMeta['sourceType'];
  name: string;
  baseUrl?: string;
  refreshIntervalMs: number;
  ingest: () => Promise<RAGChunk[]>;
  healthCheck: () => Promise<boolean>;
}

export interface RAGChunk {
  id: string;
  content: string;
  embedding?: number[];
  metadata: {
    source: string;
    sourceType: SourceMeta['sourceType'];
    category: string;
    language?: string;
    teamCode?: string;
    matchId?: string;
    venueArea?: string;
    safetyPriority?: boolean;
    sponsorRelevant?: boolean;
    freshnessScore: number;
    eventRelevance: number;
    lastUpdated: string;
  };
}

export interface RAGRankingFactors {
  semanticRelevance: number;
  eventRelevance: number;
  matchDayRelevance: number;
  venueProximity: number;
  languageFit: number;
  teamRelevance: number;
  sponsorEligibility: number;
  safetyPriority: number;
}

export function computeRAGScore(factors: RAGRankingFactors): number {
  if (factors.safetyPriority > 0.8) return 1.0;
  return (
    factors.semanticRelevance * 0.25 +
    factors.eventRelevance * 0.15 +
    factors.matchDayRelevance * 0.15 +
    factors.venueProximity * 0.10 +
    factors.languageFit * 0.10 +
    factors.teamRelevance * 0.10 +
    factors.sponsorEligibility * 0.10 +
    factors.safetyPriority * 0.05
  );
}
