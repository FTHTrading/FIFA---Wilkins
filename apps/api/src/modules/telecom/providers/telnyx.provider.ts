import { Injectable, Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';
import type { SendSmsParams, SendSmsResult, TelnyxWebhookHeaders } from '../telecom.types';

@Injectable()
export class TelnyxProvider {
  private readonly logger = new Logger(TelnyxProvider.name);
  private readonly baseUrl = 'https://api.telnyx.com/v2';

  isConfigured(): boolean {
    return Boolean(process.env.TELNYX_API_KEY) && Boolean(process.env.TELNYX_PHONE_NUMBER);
  }

  async sendSms(params: SendSmsParams): Promise<SendSmsResult> {
    const apiKey = process.env.TELNYX_API_KEY;
    if (!apiKey) {
      throw new Error('TELNYX_API_KEY is required for outbound SMS');
    }

    const payload = {
      from: params.from,
      to: params.to,
      text: params.text,
      messaging_profile_id: params.messagingProfileId ?? process.env.TELNYX_MESSAGING_PROFILE_ID,
    };

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const raw = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      this.logger.error(`Telnyx send failed (${response.status}): ${JSON.stringify(raw)}`);
      throw new Error(`Telnyx send failed (${response.status})`);
    }

    const data = (raw.data as Record<string, unknown> | undefined) ?? {};
    return {
      providerMessageId: String(data.id ?? `out_${nanoid(12)}`),
      status: String(data.status ?? 'queued'),
      raw,
    };
  }

  // Placeholder: strict signature verification can be enabled once webhook signing is finalized.
  validateWebhook(_payload: Record<string, unknown>, _headers: TelnyxWebhookHeaders): boolean {
    return true;
  }

  async healthCheck(): Promise<{ configured: boolean; healthy: boolean; details: string }> {
    if (!this.isConfigured()) {
      return { configured: false, healthy: false, details: 'Missing TELNYX_API_KEY or TELNYX_PHONE_NUMBER' };
    }
    return { configured: true, healthy: true, details: 'Telnyx credentials configured' };
  }
}
