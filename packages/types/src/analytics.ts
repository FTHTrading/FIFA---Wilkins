// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  eventId: string;
  period: { start: string; end: string };
  totalSessions: number;
  uniqueGuests: number;
  topLanguages: LanguageStat[];
  topSearches: SearchStat[];
  mostRequestedServices: ServiceStat[];
  emergencyFrequency: EmergencyStat[];
  staffResponseTimes: StaffResponseStat;
  campaignEngagement: CampaignStat[];
  topVenueZones: ZoneStat[];
  failedSearchRate: number;
}

export interface LanguageStat {
  languageCode: string;
  languageName: string;
  count: number;
  percentage: number;
}

export interface SearchStat {
  query: string;
  count: number;
  resolvedCount: number;
}

export interface ServiceStat {
  serviceId: string;
  serviceName: string;
  category: string;
  requestCount: number;
}

export interface EmergencyStat {
  phraseKey: string;
  count: number;
  resolvedCount: number;
}

export interface StaffResponseStat {
  averageResponseTimeMs: number;
  p50ResponseTimeMs: number;
  p95ResponseTimeMs: number;
  totalConversations: number;
}

export interface CampaignStat {
  campaignId: string;
  sponsorName: string;
  impressions: number;
  clicks: number;
  ctr: number;
}

export interface ZoneStat {
  zone: string;
  count: number;
}
