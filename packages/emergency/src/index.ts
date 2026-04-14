/**
 * @wilkins/emergency — Emergency phrases, escalation logic, deterministic translation packs
 *
 * Infrastructure color: Red #DC2626
 *
 * CRITICAL: Emergency content must use APPROVED translations, never pure AI.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface EmergencyOption {
  phraseKey: string;
  icon: string;
  category: 'medical' | 'safety' | 'lost' | 'communication' | 'transport';
  translations: Record<string, string>;
  audioUrls?: Record<string, string>;
  action: EmergencyAction;
}

export type EmergencyAction =
  | { type: 'map_route'; target: string }
  | { type: 'call_staff'; priority: 'normal' | 'urgent' }
  | { type: 'call_emergency'; number: string }
  | { type: 'show_phrase'; displayMode: 'fullscreen' };

export interface EmergencyIncidentReport {
  sessionId: string;
  phraseKey: string;
  eventId?: string;
  venueId?: string;
  language: string;
  latitude?: number;
  longitude?: number;
}

// ─── Presets ────────────────────────────────────────────────────────────────

export const EMERGENCY_PRESETS: readonly string[] = [
  'need_hospital',
  'need_police',
  'i_am_lost',
  'lost_child',
  'need_translator',
  'need_transportation',
  'lost_passport',
  'need_medical_assistance',
] as const;

// ─── Escalation Priority ────────────────────────────────────────────────────

export type EscalationLevel = 'low' | 'medium' | 'high' | 'critical';

export function getEscalationLevel(phraseKey: string): EscalationLevel {
  const critical = ['need_hospital', 'need_police', 'need_medical_assistance'];
  const high = ['lost_child', 'lost_passport'];
  const medium = ['i_am_lost', 'need_translator'];

  if (critical.includes(phraseKey)) return 'critical';
  if (high.includes(phraseKey)) return 'high';
  if (medium.includes(phraseKey)) return 'medium';
  return 'low';
}

// ─── UI Rules ───────────────────────────────────────────────────────────────

export const EMERGENCY_UI_RULES = {
  /** Emergency UI uses full-screen mode */
  fullScreen: true,
  /** Large translated text for readability */
  minFontSize: 24,
  /** English fallback always visible */
  showEnglishFallback: true,
  /** Voice playback when audio available */
  enableVoicePlayback: true,
  /** Map route when location-based */
  showMapRoute: true,
  /** Staff escalation always available */
  showStaffEscalation: true,
  /** Never show sponsor content in emergency */
  blockSponsorContent: true,
} as const;
