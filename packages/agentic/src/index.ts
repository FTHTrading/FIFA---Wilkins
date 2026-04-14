/**
 * @wilkins/agentic — Intent parser, tool router, RAG interfaces, orchestration
 *
 * Infrastructure color: Amber #D97706
 */

// ─── Intent Types ───────────────────────────────────────────────────────────

export type GuestIntent =
  | 'food'
  | 'food-cultural'
  | 'restroom'
  | 'medical'
  | 'emergency'
  | 'exit'
  | 'transport'
  | 'translation'
  | 'directions'
  | 'shopping'
  | 'entertainment'
  | 'general';

export interface ParsedIntent {
  intent: GuestIntent;
  confidence: number;
  venueCategory?: string;
  overpassAmenities?: string[];
  culturalContext?: string;
  rawQuery: string;
}

// ─── Tool Router ────────────────────────────────────────────────────────────

export type ToolName =
  | 'mapSearch'
  | 'nearbyPOI'
  | 'venuePOI'
  | 'culturalRank'
  | 'translate'
  | 'emergencyHandler'
  | 'sponsorInject'
  | 'faqRetrieve'
  | 'transitLookup';

export interface ToolTrace {
  tool: ToolName;
  durationMs: number;
  resultCount: number;
  error?: string;
}

export interface ToolRouterConfig {
  enabledTools: ToolName[];
  maxParallelCalls: number;
  timeoutMs: number;
}

// ─── Concierge Response Contract ────────────────────────────────────────────

export interface ConciergeResponse {
  intent: GuestIntent;
  toolsUsed: ToolTrace[];
  profile?: CulturalProfileData;
  venuePois?: unknown[];
  nearbyAmenities?: unknown[];
  emergencyOptions?: unknown[];
  sponsorRecommendations?: unknown[];
  translatedSummary?: string;
  mapContext?: {
    center?: { latitude: number; longitude: number };
    zoom?: number;
    markers?: unknown[];
  };
  explanation: string;
}

// ─── Cultural Profile ───────────────────────────────────────────────────────

export interface CulturalProfileData {
  languageCode: string;
  region?: string;
  dietaryPreferences: string[];
  cuisineAffinities: string[];
  transportPreference?: string;
  behaviorTags: string[];
  riskLevel: 'standard' | 'elevated';
}

// ─── RAG Interfaces ─────────────────────────────────────────────────────────

export interface RAGDocument {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  score: number;
}

export interface RAGQuery {
  query: string;
  language: string;
  topK: number;
  filters?: Record<string, unknown>;
}

// ─── Sponsor Ranking ────────────────────────────────────────────────────────

export interface SponsorRankingInput {
  culturalRelevance: number;
  proximity: number;
  openNow: number;
  sponsorPriority: number;
  qualityScore: number;
}

/** Blueprint formula: 0.35*cultural + 0.20*proximity + 0.10*openNow + 0.20*sponsor + 0.15*quality */
export function computeSponsorScore(input: SponsorRankingInput): number {
  return (
    input.culturalRelevance * 0.35 +
    input.proximity * 0.2 +
    input.openNow * 0.1 +
    input.sponsorPriority * 0.2 +
    input.qualityScore * 0.15
  );
}
