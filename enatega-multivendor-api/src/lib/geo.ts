/** Haversine distance in kilometres between two lat/lng points. */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function isValidLatLng(lat: unknown, lng: unknown): lat is number {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

/** Builds a closed polygon ring approximating a circle (for radius delivery bounds). */
export function circlePolygon(lng: number, lat: number, radiusKm: number, steps = 48): number[][][] {
  const ring: number[][] = [];
  const latR = radiusKm / 110.574;
  const lngR = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    ring.push([lng + lngR * Math.cos(t), lat + latR * Math.sin(t)]);
  }
  ring.push(ring[0]!);
  return [ring];
}

/** Ensures a polygon ring is closed (first point === last point). */
export function closeRings(coords: number[][][]): number[][][] {
  return coords.map((ring) => {
    if (ring.length === 0) return ring;
    const [f, l] = [ring[0]!, ring[ring.length - 1]!];
    return f[0] === l[0] && f[1] === l[1] ? ring : [...ring, f];
  });
}
