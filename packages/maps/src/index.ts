/**
 * @wilkins/maps — Map adapters, POI ranking, venue geometry helpers
 *
 * Infrastructure color: Cyan #0891B2
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  sw: GeoPoint;
  ne: GeoPoint;
}

export interface POIResult {
  id: string;
  name: string;
  nameI18n?: Record<string, string>;
  category: string;
  latitude: number;
  longitude: number;
  distanceM?: number;
  floor?: string;
  isSponsored?: boolean;
}

export interface GeocodingResult {
  placeId: string;
  placeName: string;
  latitude: number;
  longitude: number;
  category?: string;
  relevance: number;
}

export interface MapSearchParams {
  query: string;
  language?: string;
  latitude?: number;
  longitude?: number;
  bbox?: BoundingBox;
  worldview?: string;
  limit?: number;
}

export interface NearbySearchParams {
  latitude: number;
  longitude: number;
  radiusM?: number;
  amenities?: string[];
  language?: string;
  limit?: number;
}

// ─── Geometry Helpers ───────────────────────────────────────────────────────

/** Haversine distance in meters between two geo points */
export function haversineDistanceM(a: GeoPoint, b: GeoPoint): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Check if a point is within a bounding box */
export function isWithinBounds(point: GeoPoint, bounds: BoundingBox): boolean {
  return (
    point.latitude >= bounds.sw.latitude &&
    point.latitude <= bounds.ne.latitude &&
    point.longitude >= bounds.sw.longitude &&
    point.longitude <= bounds.ne.longitude
  );
}

/** Expand a bounding box by a given margin in meters (approximate) */
export function expandBounds(bounds: BoundingBox, marginM: number): BoundingBox {
  const latDelta = marginM / 111_320;
  const lngDelta =
    marginM / (111_320 * Math.cos(((bounds.sw.latitude + bounds.ne.latitude) / 2) * (Math.PI / 180)));
  return {
    sw: { latitude: bounds.sw.latitude - latDelta, longitude: bounds.sw.longitude - lngDelta },
    ne: { latitude: bounds.ne.latitude + latDelta, longitude: bounds.ne.longitude + lngDelta },
  };
}

/** Sort POI results by distance from a reference point */
export function sortByDistance(pois: POIResult[], from: GeoPoint): POIResult[] {
  return [...pois].sort((a, b) => {
    const da = haversineDistanceM(from, { latitude: a.latitude, longitude: a.longitude });
    const db = haversineDistanceM(from, { latitude: b.latitude, longitude: b.longitude });
    return da - db;
  });
}
