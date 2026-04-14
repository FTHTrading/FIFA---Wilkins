export interface TelecomAnalyticsEventInput {
  type: string;
  sessionId?: string;
  eventId?: string;
  language?: string;
  payload?: Record<string, unknown>;
}

export function buildTelecomAnalyticsEvent(input: TelecomAnalyticsEventInput): TelecomAnalyticsEventInput {
  return {
    ...input,
    payload: {
      channel: 'sms',
      ...(input.payload ?? {}),
    },
  };
}
