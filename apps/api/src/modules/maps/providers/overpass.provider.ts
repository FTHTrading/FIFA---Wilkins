import { Injectable, BadGatewayException } from '@nestjs/common';
import { withRetry, fetchWithTimeout } from '../../../common/utils/retry';

export interface OverpassPoi {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  source: 'osm';
  tags: Record<string, string>;
}

@Injectable()
export class OverpassProvider {
  private readonly endpoint = process.env.OVERPASS_ENDPOINT ?? 'https://overpass-api.de/api/interpreter';

  async searchNearbyAmenities(params: {
    latitude: number;
    longitude: number;
    radiusM?: number;
    amenities?: string[];
  }): Promise<OverpassPoi[]> {
    const radius = params.radiusM ?? 1200;
    const amenities = params.amenities?.length ? params.amenities : ['restaurant', 'cafe', 'hospital', 'pharmacy'];

    const amenityFilter = amenities.map((a) => `node[amenity=${a}](around:${radius},${params.latitude},${params.longitude});`).join('\n');

    const query = `
[out:json][timeout:25];
(
${amenityFilter}
);
out body;
`;

    const response = await withRetry(
      () =>
        fetchWithTimeout(
          this.endpoint,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(query)}`,
          },
          12_000,
        ),
      { attempts: 2, baseDelayMs: 500 },
    );

    if (!response.ok) throw new BadGatewayException('Overpass API unavailable');

    const json = (await response.json()) as {
      elements: Array<{
        id: number;
        lat: number;
        lon: number;
        tags?: Record<string, string>;
      }>;
    };

    return json.elements
      .filter((e) => e.tags?.name && e.tags?.amenity)
      .map((e) => ({
        id: `osm:${e.id}`,
        name: e.tags?.name ?? 'Unknown',
        category: e.tags?.amenity ?? 'other',
        latitude: e.lat,
        longitude: e.lon,
        source: 'osm',
        tags: e.tags ?? {},
      }));
  }
}
