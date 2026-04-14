/**
 * Translation confidence and fallback helpers.
 * These are used across both the API and frontend display layers.
 */

export const TRANSLATION_CONFIDENCE_THRESHOLDS = {
  HIGH: 0.9,
  MEDIUM: 0.7,
  LOW: 0.5,
} as const;

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNACCEPTABLE';

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= TRANSLATION_CONFIDENCE_THRESHOLDS.HIGH) return 'HIGH';
  if (score >= TRANSLATION_CONFIDENCE_THRESHOLDS.MEDIUM) return 'MEDIUM';
  if (score >= TRANSLATION_CONFIDENCE_THRESHOLDS.LOW) return 'LOW';
  return 'UNACCEPTABLE';
}

export function needsHumanReview(score: number): boolean {
  return score < TRANSLATION_CONFIDENCE_THRESHOLDS.MEDIUM;
}

/**
 * Resolves a translation for a given language with ordered fallback:
 * 1. Exact language code match (e.g. "zh-CN")
 * 2. Base language match (e.g. "zh")
 * 3. English fallback ("en")
 * 4. First available translation
 * 5. Empty string
 */
export function resolveTranslation(
  translations: Record<string, string>,
  languageCode: string,
): string {
  if (translations[languageCode]) return translations[languageCode] as string;

  const baseLang = languageCode.split('-')[0];
  if (baseLang && translations[baseLang]) return translations[baseLang] as string;

  if (translations['en']) return translations['en'] as string;

  const first = Object.values(translations)[0];
  return first ?? '';
}
