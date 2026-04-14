import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AzureTranslationProvider } from './providers/azure.provider';
import { needsHumanReview } from '@wilkins/lib';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(
    private prisma: PrismaService,
    private azureProvider: AzureTranslationProvider,
    @InjectQueue('translation') private translationQueue: Queue,
  ) {}

  /**
   * Translate a single text string and cache the result.
   * Returns cached entry if available.
   */
  async translate(text: string, from: string, to: string, key?: string, eventId?: string) {
    if (from === to) return { text, confidence: 1.0, provider: 'passthrough' };

    // Cache check
    if (key) {
      const cached = await this.prisma.translationEntry.findFirst({
        where: {
          key,
          sourceLang: from,
          targetLang: to,
          eventId: eventId ?? null,
          status: 'APPROVED',
        },
      });
      if (cached) return { text: cached.targetText, confidence: cached.confidence ?? 1.0, provider: cached.provider ?? 'cache' };
    }

    const result = await this.azureProvider.translate(text, from, to);

    // Persist translation using nullable-safe key lookup.
    const computedKey = key ?? `live:${Buffer.from(text).toString('base64url').slice(0, 32)}`;
    const existing = await this.prisma.translationEntry.findFirst({
      where: {
        key: computedKey,
        sourceLang: from,
        targetLang: to,
        eventId: eventId ?? null,
      },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.translationEntry.update({
        where: { id: existing.id },
        data: {
          targetText: result.text,
          confidence: result.confidence,
          status: needsHumanReview(result.confidence) ? 'NEEDS_REVIEW' : 'APPROVED',
        },
      });
    } else {
      await this.prisma.translationEntry.create({
        data: {
          key: computedKey,
          sourceText: text,
          sourceLang: from,
          targetText: result.text,
          targetLang: to,
          type: 'LIVE_CONVERSATIONAL',
          status: needsHumanReview(result.confidence) ? 'NEEDS_REVIEW' : 'APPROVED',
          confidence: result.confidence,
          provider: result.provider,
          eventId,
        },
      });
    }

    return result;
  }

  async getApprovedTranslations(key: string, eventId?: string) {
    return this.prisma.translationEntry.findMany({
      where: { key, status: 'APPROVED', ...(eventId ? { eventId } : {}) },
    });
  }
}
