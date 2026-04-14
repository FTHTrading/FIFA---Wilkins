// ─── Shared API Response Shapes ──────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ResponseMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  hasNext?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchQuery {
  q: string;
  languageCode: string;
  eventId?: string;
  venueId?: string;
  categories?: string[];
  limit?: number;
}

export interface SearchResult {
  id: string;
  type: 'POI' | 'SERVICE' | 'FAQ' | 'EMERGENCY';
  title: string;
  description?: string;
  category?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
  relevanceScore: number;
}
