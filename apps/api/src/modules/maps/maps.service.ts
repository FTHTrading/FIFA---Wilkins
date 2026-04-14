import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MapboxSearchProvider } from './providers/mapbox-search.provider';
import { OverpassProvider } from './providers/overpass.provider';

@Injectable()
export class MapsService {
  constructor(
    private prisma: PrismaService,
    private mapbox: MapboxSearchProvider,
    private overpass: OverpassProvider,
  ) {}

  getSourceHealth() {
    return {
      mapbox: { configured: Boolean(process.env.MAPBOX_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN) },
      overpass: { endpoint: process.env.OVERPASS_ENDPOINT ?? 'https://overpass-api.de/api/interpreter' },
    };
  }

  async searchVenuePOIs(params: {
    venueId: string;
    language?: string;
    category?: string;
    query?: string;
  }) {
    const pois = await this.prisma.venuePOI.findMany({
      where: {
        venueId: params.venueId,
        isActive: true,
        ...(params.category ? { category: params.category as never } : {}),
        ...(params.query
          ? {
              OR: [
                { name: { contains: params.query, mode: 'insensitive' } },
                { description: { contains: params.query, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    });

    return pois.map((poi: (typeof pois)[number]) => ({
      ...poi,
      localizedName:
        (poi.nameI18n as Record<string, string> | null)?.[params.language ?? 'en'] ?? poi.name,
    }));
  }

  async searchOnlineContext(params: {
    query: string;
    language?: string;
    worldview?: string;
    latitude?: number;
    longitude?: number;
    amenities?: string[];
  }) {
    const mapboxResults = await this.mapbox.forwardGeocode({
      query: params.query,
      language: params.language,
      worldview: params.worldview,
      proximity:
        params.latitude != null && params.longitude != null
          ? [params.longitude, params.latitude]
          : undefined,
    });

    let nearbyAmenities: Awaited<ReturnType<OverpassProvider['searchNearbyAmenities']>> = [];
    if (params.latitude != null && params.longitude != null) {
      nearbyAmenities = await this.overpass.searchNearbyAmenities({
        latitude: params.latitude,
        longitude: params.longitude,
        amenities: params.amenities,
      });
    }

    return {
      geocoding: mapboxResults,
      nearbyAmenities,
    };
  }
}
