import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ConciergeService {
  constructor(private prisma: PrismaService) {}

  async search(params: {
    eventId?: string;
    category?: string;
    dietaryOptions?: string[];
    query?: string;
    latitude?: number;
    longitude?: number;
    radiusM?: number;
  }) {
    const { eventId, category, query } = params;

    return this.prisma.cityService.findMany({
      where: {
        isActive: true,
        ...(eventId ? { eventId } : {}),
        ...(category ? { category } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }, { distanceM: 'asc' }],
      take: 50,
    });
  }

  async findById(id: string) {
    return this.prisma.cityService.findUniqueOrThrow({ where: { id } });
  }
}
