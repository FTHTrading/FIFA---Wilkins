import { Injectable, BadGatewayException } from '@nestjs/common';
import { withRetry, fetchWithTimeout } from '../../../common/utils/retry';

export interface MapboxSearchResult {
  id: string;
  name: string;
  fullAddress?: string;
  featureType: string;
  longitude: number;
  latitude: number;
  context?: Record<string, unknown>;
}

@Injectable()
export class MapboxSearchProvider {
  private readonly baseUrl = 'https://api.mapbox.com/search/geocode/v6';

  private get token() {
    const token = process.env.MAPBOX_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) throw new BadGatewayException('Mapbox access token not configured');
    return token;
  }

  async forwardGeocode(params: {
    query: string;
    language?: string;
    bbox?: [number, number, number, number];
    proximity?: [number, number];
    worldview?: string;
    limit?: number;
  }): Promise<MapboxSearchResult[]> {
    const search = new URLSearchParams({
      q: params.query,
      access_token: this.token,
      limit: String(params.limit ?? 8),
      language: params.language ?? 'en',
    });

    if (params.bbox) search.set('bbox', params.bbox.join(','));
    if (params.proximity) search.set('proximity', `${params.proximity[0]},${params.proximity[1]}`);
    if (params.worldview) search.set('worldview', params.worldview);

    const response = await withRetry(
      () => fetchWithTimeout(`${this.baseUrl}/forward?${search.toString()}`, {}, 8_000),
      { attempts: 3, baseDelayMs: 300 },
    );
    if (!response.ok) throw new BadGatewayException('Mapbox geocoding service unavailable');

    const data = (await response.json()) as {
      features: Array<{
        id: string;
        geometry: { coordinates: [number, number] };
        properties: {
          feature_type: string;
          name: string;
          full_address?: string;
          context?: Record<string, unknown>;
        };
      }>;
    };

    return data.features.map((feature) => ({
      id: feature.id,
      name: feature.properties.name,
      fullAddress: feature.properties.full_address,
      featureType: feature.properties.feature_type,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
      context: feature.properties.context,
    }));
  }
}
