// ─── Emergency Phrases & Scripts ─────────────────────────────────────────────

export type EmergencyCategory =
  | 'MEDICAL'
  | 'POLICE'
  | 'LOST_PERSON'
  | 'LOST_CHILD'
  | 'LOST_DOCUMENT'
  | 'TRANSPORTATION'
  | 'TRANSLATION'
  | 'GENERAL';

export type EmergencyUrgency = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export interface EmergencyPhrase {
  id: string;
  category: EmergencyCategory;
  urgency: EmergencyUrgency;
  key: string;                            // e.g. "emergency.need_hospital"
  sourceText: string;                     // English source
  translations: Record<string, string>;  // languageCode → translated text
  audioUrls?: Record<string, string>;    // languageCode → TTS audio URL
  isApproved: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// Pre-defined emergency phrase keys for the critical set
export const EMERGENCY_PHRASE_KEYS = [
  'emergency.need_hospital',
  'emergency.i_am_lost',
  'emergency.lost_passport',
  'emergency.lost_child',
  'emergency.need_police',
  'emergency.need_medical_help',
  'emergency.need_transportation',
  'emergency.need_translation_help',
] as const;

export type EmergencyPhraseKey = typeof EMERGENCY_PHRASE_KEYS[number];

// ─── Emergency Incidents ──────────────────────────────────────────────────────

export type IncidentStatus = 'OPEN' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';

export interface EmergencyIncident {
  id: string;
  sessionId: string;
  eventId: string;
  phraseKey?: EmergencyPhraseKey;
  customMessage?: string;
  guestLanguage: string;
  latitude?: number;
  longitude?: number;
  zone?: string;
  status: IncidentStatus;
  assignedStaffId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
