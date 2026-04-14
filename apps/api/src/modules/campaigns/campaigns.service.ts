import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Campaigns ─────────────────────────────────────────────────────────────

  async getActiveCampaigns(eventId: string, placement?: string, language?: string) {
    const now = new Date();
    return this.prisma.sponsorCampaign.findMany({
      where: {
        eventId,
        status: 'ACTIVE',
        ...(placement ? { placement } : {}),
        startsAt: { lte: now },
        endsAt: { gte: now },
        ...(language
          ? {
              OR: [
                { targetLanguages: { isEmpty: true } },
                { targetLanguages: { has: language } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async recordImpression(campaignId: string) {
    await this.assertCampaignExists(campaignId);
    return this.prisma.sponsorCampaign.update({
      where: { id: campaignId },
      data: { impressions: { increment: 1 } },
      select: { id: true, impressions: true },
    });
  }

  async recordClick(campaignId: string) {
    await this.assertCampaignExists(campaignId);
    return this.prisma.sponsorCampaign.update({
      where: { id: campaignId },
      data: { clicks: { increment: 1 } },
      select: { id: true, clicks: true },
    });
  }

  private async assertCampaignExists(id: string) {
    const exists = await this.prisma.sponsorCampaign.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(`Campaign ${id} not found`);
  }

  // ─── Rewards & Badges ──────────────────────────────────────────────────────

  async getActiveBadges(eventId: string) {
    const now = new Date();
    return this.prisma.rewardBadge.findMany({
      where: {
        eventId,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: [{ tier: 'asc' }, { pointsValue: 'desc' }],
    });
  }

  async claimBadge(sessionId: string, eventId: string, badgeId: string) {
    const badge = await this.prisma.rewardBadge.findFirst({
      where: { id: badgeId, eventId, isActive: true },
    });
    if (!badge) throw new NotFoundException(`Badge ${badgeId} not found`);

    if (badge.maxClaims !== null && badge.totalClaimed >= badge.maxClaims) {
      return { claimed: false, reason: 'badge_exhausted' };
    }

    // Upsert prevents double-claim (unique constraint on [sessionId, badgeId])
    const [claim] = await this.prisma.$transaction([
      this.prisma.rewardClaim.upsert({
        where: { sessionId_badgeId: { sessionId, badgeId } },
        update: {},
        create: { sessionId, eventId, badgeId },
      }),
      this.prisma.rewardBadge.update({
        where: { id: badgeId },
        data: { totalClaimed: { increment: 1 } },
      }),
      this.prisma.guestPointsLedger.create({
        data: {
          sessionId,
          eventId,
          action: 'badge_claim',
          points: badge.pointsValue,
          referenceId: badgeId,
          description: `Claimed badge: ${badge.name}`,
        },
      }),
    ]);

    return { claimed: true, claim, badge };
  }

  async getSessionPoints(sessionId: string, eventId: string) {
    const ledger = await this.prisma.guestPointsLedger.aggregate({
      where: { sessionId, eventId },
      _sum: { points: true },
    });
    const claims = await this.prisma.rewardClaim.findMany({
      where: { sessionId, eventId },
      include: { badge: { select: { id: true, name: true, icon: true, tier: true } } },
    });
    return {
      sessionId,
      eventId,
      totalPoints: ledger._sum.points ?? 0,
      badges: claims.map((c) => c.badge),
    };
  }

  // ─── Challenges ────────────────────────────────────────────────────────────

  async getActiveChallenges(eventId: string) {
    const now = new Date();
    return this.prisma.sponsorChallenge.findMany({
      where: {
        eventId,
        status: 'ACTIVE',
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      orderBy: { rewardPoints: 'desc' },
    });
  }

  async recordCouponRedemption(
    sessionId: string,
    eventId: string,
    couponCode: string,
    campaignId?: string,
    challengeId?: string,
  ) {
    const existing = await this.prisma.couponRedemption.findFirst({
      where: { sessionId, couponCode },
    });
    if (existing) return { redeemed: false, reason: 'already_redeemed' };

    const redemption = await this.prisma.couponRedemption.create({
      data: { sessionId, eventId, couponCode, campaignId, challengeId },
    });

    // Record sponsor_visit points for coupon redemption
    await this.prisma.guestPointsLedger.create({
      data: {
        sessionId,
        eventId,
        action: 'coupon_redeem',
        points: 5,
        referenceId: redemption.id,
        description: `Redeemed coupon: ${couponCode}`,
      },
    });

    return { redeemed: true, redemption };
  }
}

