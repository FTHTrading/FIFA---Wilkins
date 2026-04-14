/**
 * Maps QR-scan /tap modes to concierge-assist API queries.
 *
 * URL pattern: /tap/{mode}?zone=stadium_gate_c&lang=es&venueId=mercedes-benz-stadium
 */

export type TapMode = 'directions' | 'food' | 'rewards' | 'help' | 'vip';

export const TAP_MODES: ReadonlySet<string> = new Set<TapMode>([
  'directions',
  'food',
  'rewards',
  'help',
  'vip',
]);

interface TapIntent {
  /** Natural-language query sent to concierge-assist */
  query: string;
  /** Heading shown in the UI */
  heading: string;
  /** Short subtitle for context */
  subtitle: string;
  /** Icon emoji */
  icon: string;
}

const MODE_MAP: Record<TapMode, (zone?: string) => TapIntent> = {
  directions: (zone) => ({
    query: zone
      ? `directions to ${zone.replace(/_/g, ' ')}`
      : 'directions to the nearest gate',
    heading: 'Directions',
    subtitle: zone
      ? `Getting you to ${zone.replace(/_/g, ' ')}`
      : 'Finding the fastest route',
    icon: '🧭',
  }),
  food: () => ({
    query: 'food and restaurants near me',
    heading: 'Food & Drink',
    subtitle: 'Nearby dining options',
    icon: '🍽️',
  }),
  rewards: () => ({
    query: 'available rewards badges and challenges',
    heading: 'Rewards',
    subtitle: 'Earn points and unlock badges',
    icon: '🏆',
  }),
  help: () => ({
    query: 'I need medical help or assistance',
    heading: 'Get Help',
    subtitle: 'Medical, security, or general assistance',
    icon: '🆘',
  }),
  vip: () => ({
    query: 'VIP experience exclusive lounges and premium offers',
    heading: 'VIP Experience',
    subtitle: 'Premium access and exclusives',
    icon: '⭐',
  }),
};

export function resolveIntent(mode: string, zone?: string): TapIntent | null {
  const fn = MODE_MAP[mode as TapMode];
  return fn ? fn(zone) : null;
}

/**
 * Detect the browser / OS language and return a BCP-47 code.
 * Falls back to 'en'.
 */
export function detectLanguage(override?: string | null): string {
  if (override) return override;
  if (typeof navigator === 'undefined') return 'en';
  const nav = navigator.language || (navigator as any).userLanguage || 'en';
  // Return the primary subtag (e.g. 'es' from 'es-MX')
  return nav.split('-')[0].toLowerCase();
}
