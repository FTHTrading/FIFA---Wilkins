import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  findAll(where?: Prisma.EventWhereInput) {
    return this.prisma.event.findMany({
      where: {
        status: { in: ['PUBLISHED', 'LIVE'] },
        ...where,
      },
      include: { organization: { select: { name: true, slug: true } } },
      orderBy: { startsAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        organization: { select: { name: true, logoUrl: true } },
        venues: { where: { isActive: true } },
        eventDays: { orderBy: { date: 'asc' } },
      },
    });
    if (!event) throw new NotFoundException(`Event '${slug}' not found`);
    return event;
  }

  async findVenuePOIs(venueId: string, category?: string) {
    return this.prisma.venuePOI.findMany({
      where: {
        venueId,
        isActive: true,
        ...(category ? { category: category as Prisma.EnumPOICategoryFilter } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async getActiveAlerts(eventId: string) {
    return this.prisma.venueAlert.findMany({
      where: {
        eventId,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveAlertsBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!event) throw new NotFoundException(`Event '${slug}' not found`);
    return this.getActiveAlerts(event.id);
  }
}
