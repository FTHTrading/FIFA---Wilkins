import { randomUUID } from 'node:crypto';
import { MultilingualIntentService, type MultilingualGuestIntent } from '../../agentic/multilingual-intent.service';
import type { NormalizedInboundMessage, TelecomIntentResolution } from '../telecom.types';

const LANGUAGE_CANDIDATES = ['en', 'es', 'fr', 'pt', 'ar', 'ja', 'ko', 'zh-CN', 'de', 'it'] as const;
const EMERGENCY_KEYWORDS = ['911', 'help', 'hospital', 'police', 'fire', 'lost child', 'i am lost', 'medical'];
const REWARD_KEYWORDS = ['reward', 'rewards', 'badge', 'passport', 'points'];
const OFFER_KEYWORDS = ['offer', 'offers', 'coupon', 'deal', 'promo'];

export function normalizePhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;
  return digits.startsWith('+') ? digits : `+${digits}`;
}

export function normalizeSmsBody(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

function looksArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function looksJapanese(text: string): boolean {
  return /[\u3040-\u30FF]/.test(text);
}

function looksKorean(text: string): boolean {
  return /[\uAC00-\uD7AF]/.test(text);
}

function looksChinese(text: string): boolean {
  return /[\u4E00-\u9FFF]/.test(text) && !looksJapanese(text);
}

function looksSpanish(text: string): boolean {
  const q = text.toLowerCase();
  return (
    /[¿¡ñáéíóú]/.test(q) ||
    /\b(donde|dónde|bano|baño|necesito|ayuda|estadio|comida|gracias|por favor)\b/.test(q)
  );
}

export function detectSmsLanguage(body: string, intentService: MultilingualIntentService): string {
  if (looksArabic(body)) return 'ar';
  if (looksJapanese(body)) return 'ja';
  if (looksKorean(body)) return 'ko';
  if (looksChinese(body)) return 'zh-CN';
  if (looksSpanish(body)) return 'es';

  let bestLanguage = 'en';
  let bestConfidence = 0;
  for (const lang of LANGUAGE_CANDIDATES) {
    const result = intentService.parse(body, lang);
    if (result.confidence > bestConfidence) {
      bestLanguage = lang;
      bestConfidence = result.confidence;
    }
  }
  return bestLanguage;
}

export function isRewardIntent(body: string): boolean {
  const q = body.toLowerCase();
  return REWARD_KEYWORDS.some((k) => q.includes(k));
}

export function isOfferIntent(body: string): boolean {
  const q = body.toLowerCase();
  return OFFER_KEYWORDS.some((k) => q.includes(k));
}

export function isEmergencyOverride(body: string): boolean {
  const q = body.toLowerCase();
  return EMERGENCY_KEYWORDS.some((k) => q.includes(k));
}

export function resolveEmergencyPhraseKey(body: string): string {
  const q = body.toLowerCase();
  if ((q.includes('lost') && q.includes('child')) || q.includes('missing child')) return 'lost_child';
  if (q.includes('police')) return 'call_police';
  if (q.includes('hospital') || q.includes('medical')) return 'medical_help';
  if (q.includes('fire')) return 'fire';
  if (q.includes('ambulance') || q.includes('911')) return 'call_ambulance';
  if (q.includes('lost')) return 'i_am_lost';
  return 'medical_help';
}

export function classifyTelecomIntent(
  body: string,
  intentService: MultilingualIntentService,
  preferredLanguage?: string,
): TelecomIntentResolution {
  const normalizedBody = normalizeSmsBody(body);
  const detectedLanguage = preferredLanguage ?? detectSmsLanguage(normalizedBody, intentService);
  const parsed = intentService.parse(normalizedBody, detectedLanguage);

  const emergencyFlag = isEmergencyOverride(normalizedBody) || parsed.intent === 'emergency' || parsed.intent === 'medical';
  const rewardIntent = isRewardIntent(normalizedBody);
  const offerIntent = isOfferIntent(normalizedBody);

  let finalIntent: TelecomIntentResolution['intent'] = parsed.intent as MultilingualGuestIntent;
  if (rewardIntent) finalIntent = 'rewards';
  if (offerIntent) finalIntent = 'offers';
  if (emergencyFlag && !rewardIntent && !offerIntent) {
    finalIntent = parsed.intent === 'medical' ? 'medical' : 'emergency';
  }

  return {
    intent: finalIntent,
    confidence: parsed.confidence,
    detectedLanguage,
    emergencyFlag,
    rewardIntent,
    sponsorEligible: !emergencyFlag,
    matchedSignals: parsed.matchedSignals,
  };
}

export function normalizeTelnyxInboundPayload(
  payload: Record<string, unknown>,
): NormalizedInboundMessage | null {
  const data = (payload.data as Record<string, unknown> | undefined) ?? payload;
  const eventType = String(data.event_type ?? payload.event_type ?? '');
  if (!eventType.includes('message.received')) return null;

  const messagePayload = (data.payload as Record<string, unknown> | undefined) ?? data;
  const fromObj = messagePayload.from as Record<string, unknown> | undefined;
  const toList = messagePayload.to as Array<Record<string, unknown>> | undefined;

  const from = String(fromObj?.phone_number ?? messagePayload.from ?? '');
  const to = String(toList?.[0]?.phone_number ?? messagePayload.to ?? '');
  const text = String(messagePayload.text ?? messagePayload.body ?? '');
  if (!from || !to || !text) return null;

  return {
    provider: 'telnyx',
    providerMessageId: String(messagePayload.id ?? data.id ?? `in_${randomUUID()}`),
    from: normalizePhoneNumber(from),
    to: normalizePhoneNumber(to),
    body: normalizeSmsBody(text),
    receivedAt: new Date(String(messagePayload.received_at ?? data.occurred_at ?? new Date().toISOString())),
    raw: payload,
    channel: 'sms',
  };
}
