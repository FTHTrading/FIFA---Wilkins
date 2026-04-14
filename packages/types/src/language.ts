// ─── Languages & Locales ─────────────────────────────────────────────────────

export interface Language {
  code: string;         // BCP-47: e.g. "ar", "es", "zh-CN"
  name: string;         // English name: "Arabic"
  nativeName: string;   // Native name: "العربية"
  rtl: boolean;
  flagEmoji: string;
  isActive: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, flagEmoji: '🇺🇸', isActive: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, flagEmoji: '🇪🇸', isActive: true },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, flagEmoji: '🇫🇷', isActive: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, flagEmoji: '🇧🇷', isActive: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, flagEmoji: '🇸🇦', isActive: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, flagEmoji: '🇯🇵', isActive: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, flagEmoji: '🇰🇷', isActive: true },
  { code: 'zh-CN', name: 'Mandarin Chinese', nativeName: '中文（简体）', rtl: false, flagEmoji: '🇨🇳', isActive: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, flagEmoji: '🇩🇪', isActive: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, flagEmoji: '🇮🇹', isActive: true },
];

// ─── Translations ─────────────────────────────────────────────────────────────

export type TranslationStatus = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED';
export type TranslationType = 'STATIC_APPROVED' | 'MANAGED_DYNAMIC' | 'LIVE_CONVERSATIONAL';

export interface TranslationEntry {
  id: string;
  key: string;
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  translatedText: string;
  type: TranslationType;
  status: TranslationStatus;
  confidence?: number;
  reviewedBy?: string;
  approvedBy?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}

export interface TranslationResult {
  translatedText: string;
  confidence: number;
  provider: string;
  usedFallback: boolean;
  cachedAt?: string;
}
