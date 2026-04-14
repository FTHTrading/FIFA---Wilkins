/**
 * @wilkins/analytics — Event metrics, funnels, search analytics
 *
 * Infrastructure color: Indigo #4F46E5
 */

// ─── Event Types ────────────────────────────────────────────────────────────

export type AnalyticsEventType =
  | 'page_view'
  | 'language_selected'
  | 'poi_viewed'
  | 'poi_directions'
  | 'search'
  | 'search_no_results'
  | 'concierge_query'
  | 'emergency_activated'
  | 'emergency_resolved'
  | 'sponsor_impression'
  | 'sponsor_click'
  | 'translation_requested'
  | 'ocr_scan'
  | 'voice_translation'
  | 'staff_assist_requested'
  | 'staff_assist_resolved'
  | 'map_interaction'
  | 'session_start'
  | 'session_end';

export interface AnalyticsPayload {
  type: AnalyticsEventType;
  sessionId?: string;
  eventId?: string;
  language?: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}

// ─── Dashboard Summaries ────────────────────────────────────────────────────

export interface DashboardSummary {
  totalSessions: number;
  activeSessions: number;
  languageBreakdown: Record<string, number>;
  topSearchQueries: Array<{ query: string; count: number }>;
  failedSearches: Array<{ query: string; count: number }>;
  emergencyIncidents: number;
  sponsorImpressions: number;
  sponsorClicks: number;
  sponsorCTR: number;
  assistanceRequests: number;
  avgResponseTimeMs: number;
}

export interface LanguageFunnel {
  languageCode: string;
  sessions: number;
  searches: number;
  poiViews: number;
  emergencyUses: number;
  sponsorClicks: number;
  assistanceRequests: number;
}
