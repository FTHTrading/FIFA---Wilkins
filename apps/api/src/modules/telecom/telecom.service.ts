import { Injectable, Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AgenticService } from '../agentic/agentic.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { EmergencyService } from '../emergency/emergency.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { MultilingualIntentService } from '../agentic/multilingual-intent.service';
import {
  classifyTelecomIntent,
  normalizePhoneNumber,
  normalizeSmsBody,
  normalizeTelnyxInboundPayload,
  resolveEmergencyPhraseKey,
} from './processors/inbound-sms.processor';
import { OutboundMessageBuilder, shouldInjectSponsorOffer } from './processors/outbound-message.builder';
import { EmergencyMessageBuilder } from './processors/emergency-message.builder';
import { RewardMessageBuilder } from './processors/reward-message.builder';
import { SponsorMessageBuilder } from './processors/sponsor-message.builder';
import { resolveSmsTemplate } from './templates/sms-templates';
import { buildTelecomAnalyticsEvent } from './processors/telecom-analytics.util';
import { TelnyxProvider } from './providers/telnyx.provider';
import type {
  NormalizedInboundMessage,
  TelecomSummary,
  TelnyxWebhookHeaders,
} from './telecom.types';

@Injectable()
export class TelecomService {
  private readonly logger = new Logger(TelecomService.name);
  private readonly intentService = new MultilingualIntentService();

  constructor(
    private readonly prisma: PrismaService,
    private readonly telnyxProvider: TelnyxProvider,
    private readonly agenticService: AgenticService,
    private readonly campaignsService: CampaignsService,
    private readonly emergencyService: EmergencyService,
    private readonly analyticsService: AnalyticsService,
    private readonly outboundBuilder: OutboundMessageBuilder,
    private readonly emergencyBuilder: EmergencyMessageBuilder,
    private readonly sponsorBuilder: SponsorMessageBuilder,
    private readonly rewardBuilder: RewardMessageBuilder,
  ) {}

  getPublicCta(language = 'en') {
    return {
      systemName: 'Wilkins Media FIFA AI Connection System',
      number: '+1-888-827-3432',
      cta: {
        primary: 'Text FIFA',
        secondary: 'Tap FIFA',
        voice: 'Call FIFA',
      },
      copy: resolveSmsTemplate('welcome', language),
    };
  }

  async getHealth() {
    const providerStatus = await this.telnyxProvider.healthCheck();
    return {
      ok: true,
      provider: process.env.TELECOM_PROVIDER ?? 'telnyx',
      phoneNumber: process.env.TELNYX_PHONE_NUMBER ?? '+18888273432',
      providerStatus,
    };
  }

  async sendManualSms(to: string, text: string) {
    const normalizedTo = normalizePhoneNumber(to);
    const result = await this.telnyxProvider.sendSms({
      from: this.getSystemPhoneNumber(),
      to: normalizedTo,
      text: normalizeSmsBody(text),
    });

    await this.prisma.outboundMessage.create({
      data: {
        phoneNumber: normalizedTo,
        body: normalizeSmsBody(text),
        externalMessageId: result.providerMessageId,
        externalProvider: 'telnyx',
        status: 'SENT',
        direction: 'OUTBOUND',
        metadata: result.raw as Prisma.InputJsonValue,
      },
    });

    return { ok: true, to: normalizedTo, ...result };
  }

  async handleInboundSmsWebhook(payload: Record<string, unknown>, headers: TelnyxWebhookHeaders) {
    if (!this.telnyxProvider.validateWebhook(payload, headers)) {
      return { ok: false, reason: 'invalid_signature' };
    }

    const normalized = normalizeTelnyxInboundPayload(payload);
    if (!normalized) {
      return { ok: true, ignored: true };
    }

    const telecomSession = await this.getOrCreateTelecomSession(normalized.from);
    const intent = classifyTelecomIntent(
      normalized.body,
      this.intentService,
      telecomSession.preferredLanguage ?? undefined,
    );

    const eventId = await this.resolveEventId(telecomSession.eventId ?? undefined);
    const venueId = process.env.TELECOM_DEFAULT_VENUE_ID ?? process.env.NEXT_PUBLIC_DEFAULT_VENUE_ID ?? 'mercedes-benz-stadium';

    await this.prisma.inboundMessage.create({
      data: {
        telecomSessionId: telecomSession.id,
        sessionId: telecomSession.guestSessionId,
        phoneNumber: normalized.from,
        body: normalized.body,
        normalizedBody: normalized.body.toLowerCase(),
        detectedLanguage: intent.detectedLanguage,
        intent: intent.intent,
        emergencyFlag: intent.emergencyFlag,
        externalMessageId: normalized.providerMessageId,
        externalProvider: normalized.provider,
        direction: 'INBOUND',
        status: 'RECEIVED',
        metadata: normalized.raw as Prisma.InputJsonValue,
      },
    });

    const inboundEvent = buildTelecomAnalyticsEvent({
      type: 'telecom_inbound_sms',
      sessionId: telecomSession.guestSessionId ?? undefined,
      eventId: eventId ?? undefined,
      language: intent.detectedLanguage,
      payload: {
        intent: intent.intent,
        emergencyFlag: intent.emergencyFlag,
      },
    });
    await this.analyticsService.track(
      inboundEvent.type,
      inboundEvent.sessionId,
      inboundEvent.eventId,
      inboundEvent.language,
      inboundEvent.payload,
    );

    let responseBody = resolveSmsTemplate('fallback', intent.detectedLanguage);
    let campaignId: string | undefined;

    if (intent.emergencyFlag) {
      responseBody = await this.handleEmergencyFlow(normalized, telecomSession.guestSessionId ?? undefined, eventId, intent.detectedLanguage);
    } else if (intent.rewardIntent || intent.intent === 'rewards') {
      responseBody = await this.handleRewardsFlow(telecomSession.guestSessionId ?? undefined, eventId, intent.detectedLanguage);
    } else if (intent.intent === 'offers') {
      const offerResult = await this.handleOffersFlow(eventId, intent.detectedLanguage);
      responseBody = offerResult.body;
      campaignId = offerResult.campaignId;
    } else {
      const concierge = await this.handleConciergeFlow(
        normalized,
        intent.detectedLanguage,
        venueId,
        eventId,
        intent.intent,
      );
      responseBody = concierge.body;
      campaignId = concierge.campaignId;
    }

    const outboundResult = await this.dispatchOutboundSms({
      telecomSessionId: telecomSession.id,
      sessionId: telecomSession.guestSessionId ?? undefined,
      to: normalized.from,
      body: responseBody,
      detectedLanguage: intent.detectedLanguage,
      intent: intent.intent,
      emergencyFlag: intent.emergencyFlag,
      eventId,
      campaignId,
    });

    return {
      ok: true,
      messageId: normalized.providerMessageId,
      intent: intent.intent,
      language: intent.detectedLanguage,
      emergency: intent.emergencyFlag,
      outboundId: outboundResult.providerMessageId,
    };
  }

  async handleDeliveryStatusWebhook(payload: Record<string, unknown>) {
    const data = (payload.data as Record<string, unknown> | undefined) ?? payload;
    const eventType = String(data.event_type ?? payload.event_type ?? '');
    const details = (data.payload as Record<string, unknown> | undefined) ?? data;

    const externalMessageId = String(details.id ?? details.message_id ?? '');
    const providerStatus = String(details.status ?? eventType ?? 'unknown').toUpperCase();
    if (!externalMessageId) {
      return { ok: true, ignored: true };
    }

    const mappedStatus = providerStatus.includes('DELIVER')
      ? 'DELIVERED'
      : providerStatus.includes('FAIL')
      ? 'FAILED'
      : 'SENT';

    const outbound = await this.prisma.outboundMessage.findFirst({
      where: { externalMessageId },
      select: { id: true, sessionId: true, telecomSessionId: true },
    });

    if (outbound) {
      await this.prisma.outboundMessage.update({
        where: { id: outbound.id },
        data: {
          status: mappedStatus as never,
          deliveredAt: mappedStatus === 'DELIVERED' ? new Date() : undefined,
        },
      });

      await this.prisma.deliveryStatus.create({
        data: {
          outboundMessageId: outbound.id,
          externalMessageId,
          providerStatus,
          status: mappedStatus as never,
          metadata: payload as Prisma.InputJsonValue,
        },
      });
    }

    return { ok: true };
  }

  async handleInboundVoiceWebhook(payload: Record<string, unknown>) {
    const data = (payload.data as Record<string, unknown> | undefined) ?? payload;
    const details = (data.payload as Record<string, unknown> | undefined) ?? data;
    const from = normalizePhoneNumber(String((details.from as Record<string, unknown> | undefined)?.phone_number ?? details.from ?? ''));
    const transcript = String(details.transcript ?? details.speech_to_text ?? '').trim();

    if (!from) {
      return { ok: true, ignored: true };
    }

    if (transcript.length > 0) {
      const simulatedSmsPayload = {
        data: {
          event_type: 'message.received',
          payload: {
            id: `voice-${nanoid(10)}`,
            from: { phone_number: from },
            to: [{ phone_number: this.getSystemPhoneNumber() }],
            text: transcript,
            received_at: new Date().toISOString(),
          },
        },
      };
      await this.handleInboundSmsWebhook(simulatedSmsPayload, {});
    }

    await this.prisma.telecomEvent.create({
      data: {
        type: 'voice_inbound_scaffold',
        channel: 'VOICE',
        phoneNumber: from,
        metadata: {
          transcriptPresent: transcript.length > 0,
        } as Prisma.InputJsonValue,
      },
    });

    return {
      ok: true,
      message: 'Voice webhook received. SMS follow-up scaffold is active.',
    };
  }

  async getSummary(eventId?: string, days = 7): Promise<TelecomSummary> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      inboundTotal,
      outboundTotal,
      emergencyCount,
      inboundRows,
      sponsorImpressions,
      sponsorClicks,
      rewardClaims,
      mapLinkOpens,
      providerStatus,
    ] = await Promise.all([
      this.prisma.inboundMessage.count({
        where: { createdAt: { gte: since } },
      }),
      this.prisma.outboundMessage.count({
        where: { createdAt: { gte: since } },
      }),
      this.prisma.inboundMessage.count({
        where: { createdAt: { gte: since }, emergencyFlag: true },
      }),
      this.prisma.inboundMessage.findMany({
        select: { detectedLanguage: true, intent: true },
        where: { createdAt: { gte: since } },
        take: 5000,
      }),
      this.prisma.telecomEvent.count({
        where: { createdAt: { gte: since }, type: 'sponsor_impression' },
      }),
      this.prisma.telecomEvent.count({
        where: { createdAt: { gte: since }, type: 'sponsor_click' },
      }),
      this.prisma.telecomEvent.count({
        where: { createdAt: { gte: since }, type: 'reward_claim' },
      }),
      this.prisma.telecomEvent.count({
        where: { createdAt: { gte: since }, type: 'map_link_open' },
      }),
      this.telnyxProvider.healthCheck(),
    ]);

    const conversionRate = sponsorImpressions > 0 ? sponsorClicks / sponsorImpressions : 0;
    const languageMap = new Map<string | null, number>();
    const intentMap = new Map<string | null, number>();

    for (const row of inboundRows) {
      languageMap.set(row.detectedLanguage, (languageMap.get(row.detectedLanguage) ?? 0) + 1);
      intentMap.set(row.intent, (intentMap.get(row.intent) ?? 0) + 1);
    }

    const languageBreakdown = Array.from(languageMap.entries())
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const intentBreakdown = Array.from(intentMap.entries())
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      provider: process.env.TELECOM_PROVIDER ?? 'telnyx',
      number: '+1-888-827-3432',
      inboundTotal,
      outboundTotal,
      emergencyCount,
      sponsorImpressions,
      rewardClaims,
      mapLinkOpens,
      conversionRate,
      languageBreakdown,
      intentBreakdown,
      providerStatus,
    };
  }

  private async handleEmergencyFlow(
    normalized: NormalizedInboundMessage,
    sessionId: string | undefined,
    eventId: string | undefined,
    language: string,
  ) {
    const phraseKey = resolveEmergencyPhraseKey(normalized.body);

    await this.emergencyService.createIncident({
      sessionId: sessionId ?? `sms-${nanoid(8)}`,
      phraseKey,
      language,
      eventId,
      location: `sms:${normalized.from}`,
    });

    await this.prisma.assistanceRequest.create({
      data: {
        sessionId: sessionId ?? `sms-${nanoid(8)}`,
        eventId: eventId ?? process.env.TELECOM_DEFAULT_EVENT_ID ?? process.env.NEXT_PUBLIC_DEFAULT_EVENT_ID ?? 'atlanta-2026',
        type: phraseKey.includes('lost') ? 'lost_child' : phraseKey.includes('medical') ? 'medical' : 'emergency',
        status: 'ESCALATED',
        priority: 'URGENT',
        guestLanguage: language,
        originalMessage: normalized.body,
        translatedMessage: normalized.body,
        location: `sms:${normalized.from}`,
        escalatedAt: new Date(),
      },
    });

    await this.prisma.telecomEvent.create({
      data: {
        type: 'emergency_routed',
        sessionId,
        eventId,
        channel: 'SMS',
        phoneNumber: normalized.from,
        language,
        intent: 'emergency',
        emergencyFlag: true,
        metadata: {
          phraseKey,
          from: normalized.from,
        } as Prisma.InputJsonValue,
      },
    });

    return this.emergencyBuilder.build({
      phraseKey,
      language,
      supportLink: this.buildPublicLink('emergency', { lang: language, via: 'sms' }),
    });
  }

  private async handleRewardsFlow(sessionId: string | undefined, eventId: string | undefined, language: string) {
    const rewards = sessionId && eventId
      ? await this.campaignsService.getSessionPoints(sessionId, eventId)
      : { totalPoints: 0, badges: [] as Array<{ name: string }> };

    const rewardLink = this.buildPublicLink('rewards', { lang: language, via: 'sms' });
    const rewardLine = this.rewardBuilder.build({
      points: rewards.totalPoints,
      badgeNames: rewards.badges.map((b) => b.name),
      rewardLink,
    });

    await this.prisma.telecomEvent.create({
      data: {
        type: 'reward_summary_requested',
        sessionId,
        eventId,
        channel: 'SMS',
        language,
        intent: 'rewards',
        metadata: { totalPoints: rewards.totalPoints } as Prisma.InputJsonValue,
      },
    });

    return this.outboundBuilder.build({
      language,
      greeting: 'Text FIFA - Rewards',
      primaryLines: [rewardLine],
      footer: 'Tap FIFA to unlock offers and rewards.',
    }).body;
  }

  private async handleOffersFlow(eventId: string | undefined, language: string) {
    if (!eventId) {
      return {
        body: this.outboundBuilder.build({
          language,
          primaryLines: ['Offers are available after event profile is configured.'],
          footer: 'Tap FIFA to unlock offers and rewards.',
        }).body,
        campaignId: undefined,
      };
    }

    const campaigns = await this.campaignsService.getActiveCampaigns(eventId, 'concierge_card', language);
    const selected = campaigns[0];
    if (!selected) {
      return {
        body: this.outboundBuilder.build({
          language,
          primaryLines: ['No active sponsor offers at this moment. Try again during match hours.'],
        }).body,
        campaignId: undefined,
      };
    }

    await this.campaignsService.recordImpression(selected.id);
    await this.prisma.telecomEvent.create({
      data: {
        type: 'sponsor_impression',
        eventId,
        channel: 'SMS',
        language,
        intent: 'offers',
        campaignId: selected.id,
        metadata: { source: 'offers_flow' } as Prisma.InputJsonValue,
      },
    });

    const sponsorLine = this.sponsorBuilder.build({
      sponsorName: selected.sponsorName,
      campaignName: selected.name,
      ctaText: selected.ctaText,
      ctaUrl: this.buildPublicLink('offer', { campaignId: selected.id, lang: language }),
    });

    return {
      body: this.outboundBuilder.build({
        language,
        greeting: 'Text FIFA - Offers',
        primaryLines: ['Top sponsor offer right now:'],
        sponsorLine,
        footer: 'Text FIFA for live help in your language.',
      }).body,
      campaignId: selected.id,
    };
  }

  private async handleConciergeFlow(
    normalized: NormalizedInboundMessage,
    language: string,
    venueId: string,
    eventId: string | undefined,
    intent: string,
  ) {
    const response = await this.agenticService.conciergeAssist({
      query: normalized.body,
      language,
      venueId,
      eventId,
    });

    const venueLines = response.venuePois.slice(0, 2).map((poi: { localizedName?: string; name: string }) => poi.localizedName ?? poi.name);
    const nearbyLines = response.nearbyAmenities.slice(0, 2).map((poi: { name: string }) => poi.name ?? 'Nearby option');
    const topLines = [...venueLines, ...nearbyLines].slice(0, 3);

    const primaryLines = topLines.length > 0
      ? topLines.map((line, idx) => `${idx + 1}. ${line}`)
      : [resolveSmsTemplate('fallback', language)];

    let campaignId: string | undefined;
    let sponsorLine: string | undefined;

    if (shouldInjectSponsorOffer(intent, false) && response.sponsorRecommendations.length > 0) {
      const sponsor = response.sponsorRecommendations[0];
      if (sponsor) {
        campaignId = sponsor.id;
        sponsorLine = this.sponsorBuilder.build({
          sponsorName: sponsor.sponsorName,
          campaignName: sponsor.name,
          ctaText: sponsor.ctaText,
          ctaUrl: this.buildPublicLink('offer', { campaignId: sponsor.id, lang: language }),
        });
      }

      if (campaignId) {
        await this.campaignsService.recordImpression(campaignId);
        await this.prisma.telecomEvent.create({
          data: {
            type: 'sponsor_impression',
            eventId,
            channel: 'SMS',
            language,
            intent,
            campaignId,
            metadata: { source: 'concierge_flow' } as Prisma.InputJsonValue,
          },
        });
      }
    }

    return {
      body: this.outboundBuilder.build({
        language,
        greeting: 'Text FIFA',
        primaryLines,
        mapLink: this.buildPublicLink('map', { q: normalized.body, lang: language }),
        sponsorLine,
        footer: 'Text FIFA for live help in your language.',
      }).body,
      campaignId,
    };
  }

  private async dispatchOutboundSms(params: {
    telecomSessionId?: string;
    sessionId?: string;
    to: string;
    body: string;
    detectedLanguage: string;
    intent: string;
    emergencyFlag: boolean;
    eventId?: string;
    campaignId?: string;
  }) {
    const sendResult = await this.telnyxProvider.sendSms({
      from: this.getSystemPhoneNumber(),
      to: params.to,
      text: params.body,
      messagingProfileId: process.env.TELNYX_MESSAGING_PROFILE_ID,
    });

    await this.prisma.outboundMessage.create({
      data: {
        telecomSessionId: params.telecomSessionId,
        sessionId: params.sessionId,
        phoneNumber: params.to,
        body: params.body,
        detectedLanguage: params.detectedLanguage,
        intent: params.intent,
        campaignId: params.campaignId,
        emergencyFlag: params.emergencyFlag,
        direction: 'OUTBOUND',
        status: 'SENT',
        externalMessageId: sendResult.providerMessageId,
        externalProvider: 'telnyx',
        metadata: sendResult.raw as Prisma.InputJsonValue,
      },
    });

    await this.analyticsService.track(
      'telecom_outbound_sms',
      params.sessionId,
      params.eventId,
      params.detectedLanguage,
      {
        channel: 'sms',
        intent: params.intent,
        emergencyFlag: params.emergencyFlag,
      },
    );

    return sendResult;
  }

  private async getOrCreateTelecomSession(phoneNumber: string) {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const existing = await this.prisma.telecomSession.findFirst({
      where: {
        normalizedPhone,
        channel: 'SMS',
      },
    });

    if (existing) {
      return existing;
    }

    const guestSessionId = `sms_${nanoid(16)}`;
    await this.prisma.guestSession.create({
      data: {
        sessionId: guestSessionId,
        languageCode: 'en',
        venueId: process.env.TELECOM_DEFAULT_VENUE_ID ?? process.env.NEXT_PUBLIC_DEFAULT_VENUE_ID,
      },
    });

    return this.prisma.telecomSession.create({
      data: {
        phoneNumber: phoneNumber,
        normalizedPhone,
        channel: 'SMS',
        provider: 'TELNYX',
        guestSessionId,
        eventId: process.env.TELECOM_DEFAULT_EVENT_ID,
        isActive: true,
      },
    });
  }

  private async resolveEventId(eventId?: string): Promise<string | undefined> {
    const candidate = eventId ?? process.env.TELECOM_DEFAULT_EVENT_ID;
    if (!candidate) return undefined;

    const byId = await this.prisma.event.findUnique({ where: { id: candidate }, select: { id: true } });
    if (byId) return byId.id;

    const bySlug = await this.prisma.event.findUnique({ where: { slug: candidate }, select: { id: true } });
    return bySlug?.id;
  }

  private getSystemPhoneNumber(): string {
    return normalizePhoneNumber(process.env.TELNYX_PHONE_NUMBER ?? '+18888273432');
  }

  private buildPublicLink(type: 'map' | 'rewards' | 'offer' | 'emergency', params: Record<string, string | undefined>) {
    const base = (process.env.TELECOM_PUBLIC_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    const path = type === 'map' ? '/event/map' : '/event';
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => Boolean(value)) as Array<[string, string]>);
    return `${base}${path}${query.toString() ? `?${query.toString()}` : ''}`;
  }
}
