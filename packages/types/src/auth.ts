// ─── Auth & Users ────────────────────────────────────────────────────────────

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'TRANSLATOR_REVIEWER'
  | 'STAFF'
  | 'SPONSOR_MANAGER'
  | 'GUEST';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuestSession {
  sessionId: string;
  languageCode: string;
  eventId?: string;
  venueId?: string;
  startedAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}
