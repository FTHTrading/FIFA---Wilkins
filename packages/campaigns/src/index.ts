/**
 * @wilkins/campaigns — Sponsor logic, targeting rules, monetization surfaces,
 *                      cultural scoring engine, reward/challenge types
 *
 * Infrastructure color: Fuchsia #C026D3
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type SponsorType =
  | 'restaurant'
  | 'transit'
  | 'hotel'
  | 'shopping'
  | 'official_brand'
  | 'hospitality_partner'
  | 'emergency_support';

export type CampaignPlacement =
  | 'home_banner'
  | 'map_overlay'
  | 'concierge_card'
  | 'language_select'
  | 'search_result'
  | 'poi_detail';

export interface SponsorMatchInputs {
  language: string;
  region?: string;
  venueId?: string;
  eventId: string;
  latitude?: number;
  longitude?: number;
  queryIntent?: string;
  culturalProfile?: {
    dietaryPreferences: string[];
    cuisineAffinities: string[];
  };
  timeWindow?: { start: Date; end: Date };
}

export interface SponsorRecommendationResult {
  campaignId: string;
  sponsorName: string;
  placement: CampaignPlacement;
  score: number;
  reason: string;
  ctaText?: string;
  ctaUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

// ─── Display Rules ──────────────────────────────────────────────────────────

export const SPONSOR_DISPLAY_RULES = {
  /** Always label promoted placements */
  requirePromotedLabel: true,
  /** Maximum sponsor items per result set */
  maxSponsorDensity: 2,
  /** Never show sponsors during emergency */
  blockDuringEmergency: true,
  /** Never override organic emergency results */
  neverOverrideEmergency: true,
  /** Maintain trust — don't degrade organic results */
  maxSponsorRatio: 0.2,
} as const;

// ─── Ranking Formula ────────────────────────────────────────────────────────

export interface SponsorScoreFactors {
  culturalRelevance: number; // 0–1
  proximity: number;         // 0–1
  openNow: number;           // 0 or 1
  sponsorPriority: number;   // 0–1
  qualityScore: number;      // 0–1
}

/**
 * Sponsor ranking formula per blueprint:
 * final_score = cultural_relevance * 0.35 + proximity * 0.20 + open_now * 0.10 + sponsor_priority * 0.20 + quality_score * 0.15
 */
export function computeSponsorFinalScore(factors: SponsorScoreFactors): number {
  return (
    factors.culturalRelevance * 0.35 +
    factors.proximity * 0.2 +
    factors.openNow * 0.1 +
    factors.sponsorPriority * 0.2 +
    factors.qualityScore * 0.15
  );
}

// ─── Cultural Scoring Engine ────────────────────────────────────────────────

/**
 * The 10-factor cultural relevance scoring model.
 * Each factor is 0–1, combined with tuned weights.
 */
export interface CulturalScoreInputs {
  intentMatch: number;       // does the sponsor serve the stated intent?
  culturalMatch: number;     // cuisine/dietary/regional affinity
  proximity: number;         // geo-distance score (1 = closest, 0 = far)
  trustScore: number;        // rating, verified, community feedback
  sponsorPriority: number;   // paid priority tier 0–1
  timeRelevance: number;     // open now, halftime window, post-match
  languageMatch: number;     // sponsor supports guest language?
  dietaryMatch: number;      // halal, kosher, vegan alignment
  familyFriendly: number;    // child-safe, group-friendly
  urgency: number;           // emergency need boosts medical/transit
}

export const CULTURAL_SCORE_WEIGHTS = {
  intentMatch: 0.20,
  culturalMatch: 0.18,
  proximity: 0.12,
  trustScore: 0.10,
  sponsorPriority: 0.10,
  timeRelevance: 0.08,
  languageMatch: 0.08,
  dietaryMatch: 0.06,
  familyFriendly: 0.04,
  urgency: 0.04,
} as const;

export function computeCulturalScore(inputs: CulturalScoreInputs): number {
  return (
    inputs.intentMatch * CULTURAL_SCORE_WEIGHTS.intentMatch +
    inputs.culturalMatch * CULTURAL_SCORE_WEIGHTS.culturalMatch +
    inputs.proximity * CULTURAL_SCORE_WEIGHTS.proximity +
    inputs.trustScore * CULTURAL_SCORE_WEIGHTS.trustScore +
    inputs.sponsorPriority * CULTURAL_SCORE_WEIGHTS.sponsorPriority +
    inputs.timeRelevance * CULTURAL_SCORE_WEIGHTS.timeRelevance +
    inputs.languageMatch * CULTURAL_SCORE_WEIGHTS.languageMatch +
    inputs.dietaryMatch * CULTURAL_SCORE_WEIGHTS.dietaryMatch +
    inputs.familyFriendly * CULTURAL_SCORE_WEIGHTS.familyFriendly +
    inputs.urgency * CULTURAL_SCORE_WEIGHTS.urgency
  );
}

// ─── Cultural Profile Defaults ──────────────────────────────────────────────

export interface LanguageCulturalDefaults {
  language: string;
  region: string;
  dietaryPreferences: string[];
  cuisineAffinities: string[];
  behaviors: string[];
}

/**
 * Default cultural profile per language — used when no explicit profile exists.
 * These are probability-weighted defaults, not stereotypes.
 * The concierge uses them as starting signals, overridden by explicit prefs.
 */
export const LANGUAGE_CULTURAL_DEFAULTS: LanguageCulturalDefaults[] = [
  {
    language: 'ar',
    region: 'MENA',
    dietaryPreferences: ['halal'],
    cuisineAffinities: ['middle_eastern', 'halal', 'mediterranean'],
    behaviors: ['prayer_time_aware', 'family_group', 'formal_greeting'],
  },
  {
    language: 'es',
    region: 'LATAM',
    dietaryPreferences: [],
    cuisineAffinities: ['latin', 'mexican', 'cuban', 'south_american'],
    behaviors: ['family_group', 'social_dining', 'late_evening'],
  },
  {
    language: 'pt',
    region: 'LUSOPHONE',
    dietaryPreferences: [],
    cuisineAffinities: ['brazilian', 'south_american', 'steakhouse'],
    behaviors: ['social_dining', 'nightlife', 'group_photo'],
  },
  {
    language: 'fr',
    region: 'FRANCOPHONE',
    dietaryPreferences: [],
    cuisineAffinities: ['french', 'mediterranean', 'fine_dining'],
    behaviors: ['formal_greeting', 'wine_preference', 'late_dining'],
  },
  {
    language: 'ja',
    region: 'EAST_ASIA',
    dietaryPreferences: [],
    cuisineAffinities: ['japanese', 'sushi', 'ramen'],
    behaviors: ['quiet_preference', 'quality_focus', 'punctuality'],
  },
  {
    language: 'ko',
    region: 'EAST_ASIA',
    dietaryPreferences: [],
    cuisineAffinities: ['korean', 'bbq', 'noodles'],
    behaviors: ['group_dining', 'quality_focus', 'tech_savvy'],
  },
  {
    language: 'de',
    region: 'DACH',
    dietaryPreferences: [],
    cuisineAffinities: ['german', 'european', 'beer_garden'],
    behaviors: ['punctuality', 'efficiency', 'direct_communication'],
  },
  {
    language: 'zh-CN',
    region: 'EAST_ASIA',
    dietaryPreferences: [],
    cuisineAffinities: ['chinese', 'dim_sum', 'hot_pot'],
    behaviors: ['group_dining', 'photo_culture', 'digital_payment'],
  },
];

export function getLanguageCulturalDefaults(language: string): LanguageCulturalDefaults | undefined {
  return LANGUAGE_CULTURAL_DEFAULTS.find((d) => d.language === language);
}

// ─── Geo-Fenced Trigger Types ───────────────────────────────────────────────

export type GeoTriggerType = 'enter' | 'exit' | 'dwell';
export type ChallengeType = 'visit' | 'scan_qr' | 'checkin' | 'survey' | 'scavenger_hunt' | 'multi_step';

export interface GeoFencedOffer {
  fenceId: string;
  triggerType: GeoTriggerType;
  campaignId: string;
  sponsorName: string;
  message: string;
  messageI18n?: Record<string, string>;
  couponCode?: string;
  couponValue?: string;
  expiresAt?: Date;
}

// ─── Reward & Badge Types ───────────────────────────────────────────────────

export type BadgeTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface RewardBadge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  pointsValue: number;
  sponsorId?: string;
  requirement: string;
}

export interface GuestPointsSummary {
  sessionId: string;
  totalPoints: number;
  badgeCount: number;
  challengesCompleted: number;
  couponsRedeemed: number;
}

// ─── Sponsor Tier Packaging ─────────────────────────────────────────────────

export type SponsorTier = 'SMART_PLACEMENT' | 'CULTURAL_CONCIERGE' | 'REWARD_ENGINE';

export interface SponsorTierConfig {
  tier: SponsorTier;
  name: string;
  description: string;
  features: string[];
  priceRange: string;
}

export const SPONSOR_TIERS: SponsorTierConfig[] = [
  {
    tier: 'SMART_PLACEMENT',
    name: 'Smart Placement',
    description: 'Language-specific offers, map placements, coupon delivery',
    features: [
      'Language-targeted offers',
      'Map pin placement',
      'Concierge card placement',
      'Basic impression/click analytics',
      'QR coupon delivery',
    ],
    priceRange: '$2,500–$10,000/event',
  },
  {
    tier: 'CULTURAL_CONCIERGE',
    name: 'Cultural Concierge',
    description: 'Cuisine relevance, family routing, regional targeting, post-match suggestions',
    features: [
      'All Smart Placement features',
      'Cultural relevance scoring',
      'Dietary/cuisine affinity targeting',
      'Family-friendly routing',
      'Time-window promotions',
      'Post-match retention offers',
      'Language & region analytics',
    ],
    priceRange: '$10,000–$50,000/event',
  },
  {
    tier: 'REWARD_ENGINE',
    name: 'Reward Engine',
    description: 'Passport challenges, badges, drops, hospitality unlocks, premium analytics',
    features: [
      'All Cultural Concierge features',
      'Sponsor-branded badges',
      'QR quest challenges',
      'Scavenger hunts',
      'Digital passport stamps',
      'Geo-fenced activations',
      'Coupon redemption tracking',
      'Guest points wallet integration',
      'Premium analytics dashboard',
      'Optional on-chain collectible minting',
    ],
    priceRange: '$50,000–$250,000/event',
  },
];
