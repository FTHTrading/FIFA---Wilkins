import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async track(type: string, sessionId?: string, eventId?: string, language?: string, payload?: Record<string, unknown>) {
    return this.prisma.analyticsEvent.create({
      data: {
        type,
        sessionId,
        eventId,
        language,
        payload: payload as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async getSummary(eventId: string) {
    const [totalSessions, langBreakdown, topSearches] = await Promise.all([
      this.prisma.guestSession.count({ where: { eventId } }),
      this.prisma.analyticsEvent.groupBy({
        by: ['language'],
        where: { eventId, type: 'language_selected' },
        _count: true,
        orderBy: { _count: { language: 'desc' } },
      }),
      this.prisma.analyticsEvent.groupBy({
        by: ['payload'],
        where: { eventId, type: 'search' },
        _count: true,
        orderBy: { _count: { payload: 'desc' } },
        take: 10,
      }),
    ]);

    return { totalSessions, langBreakdown, topSearches };
  }
}
