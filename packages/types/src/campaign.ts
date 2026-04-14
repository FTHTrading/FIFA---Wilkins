// ─── Sponsor Campaigns ───────────────────────────────────────────────────────

export type CampaignStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type PlacementType = 'BANNER' | 'CARD' | 'FEATURED_LISTING' | 'INTERSTITIAL' | 'MAP_PIN' | 'ALERT_SPONSOR';

export interface SponsorCampaign {
  id: string;
  organizationId: string;
  sponsorName: string;
  sponsorLogoUrl?: string;
  title: string;
  titleTranslations: Record<string, string>;
  bodyText?: string;
  bodyTranslations: Record<string, string>;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  placementType: PlacementType;
  targetLanguages: string[];    // empty = all languages
  targetEventIds: string[];     // empty = all events
  targetVenueIds: string[];     // empty = all venues
  targetZones: string[];        // geofence zone IDs
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}
