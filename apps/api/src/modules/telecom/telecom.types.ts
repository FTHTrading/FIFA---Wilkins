export type TelecomRuntimeChannel = 'sms' | 'voice';

export interface NormalizedInboundMessage {
  provider: 'telnyx';
  providerMessageId: string;
  from: string;
  to: string;
  body: string;
  receivedAt: Date;
  raw: Record<string, unknown>;
  channel: TelecomRuntimeChannel;
}

export interface TelecomIntentResolution {
  intent:
    | 'food'
    | 'food-cultural'
    | 'restroom'
    | 'medical'
    | 'emergency'
    | 'exit'
    | 'transport'
    | 'translation'
    | 'directions'
    | 'shopping'
    | 'entertainment'
    | 'general'
    | 'rewards'
    | 'offers';
  confidence: number;
  detectedLanguage: string;
  emergencyFlag: boolean;
  sponsorEligible: boolean;
  rewardIntent: boolean;
  matchedSignals: string[];
}

export interface OutboundBuildInput {
  language: string;
  greeting?: string;
  primaryLines: string[];
  mapLink?: string;
  sponsorLine?: string;
  rewardLine?: string;
  footer?: string;
}

export interface OutboundBuildResult {
  body: string;
  segments: string[];
}

export interface SendSmsParams {
  from: string;
  to: string;
  text: string;
  messagingProfileId?: string;
}

export interface SendSmsResult {
  providerMessageId: string;
  status: string;
  raw: Record<string, unknown>;
}

export interface TelnyxWebhookHeaders {
  signature?: string;
  timestamp?: string;
}

export interface TelecomSummary {
  provider: string;
  number: string;
  inboundTotal: number;
  outboundTotal: number;
  emergencyCount: number;
  sponsorImpressions: number;
  rewardClaims: number;
  mapLinkOpens: number;
  conversionRate: number;
  languageBreakdown: Array<{ language: string | null; count: number }>;
  intentBreakdown: Array<{ intent: string | null; count: number }>;
  providerStatus: {
    configured: boolean;
    healthy: boolean;
    details: string;
  };
}
