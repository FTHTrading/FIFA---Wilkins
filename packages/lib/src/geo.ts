/**
 * Geospatial utility functions.
 * Uses the Haversine formula for distance calculations.
 */

const EARTH_RADIUS_KM = 6371;

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/** Returns distance as human-readable string: "0.3 km" or "300 m" */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

/** Sorts an array of items by distance from a reference point */
export function sortByDistance<T extends LatLng>(items: T[], from: LatLng): T[] {
  return [...items].sort(
    (a, b) =>
      haversineDistance(from.latitude, from.longitude, a.latitude, a.longitude) -
      haversineDistance(from.latitude, from.longitude, b.latitude, b.longitude),
  );
}

/** Filters items within a radius (km) from a reference point */
export function filterByRadius<T extends LatLng>(items: T[], from: LatLng, radiusKm: number): T[] {
  return items.filter(
    (item) =>
      haversineDistance(from.latitude, from.longitude, item.latitude, item.longitude) <= radiusKm,
  );
}
