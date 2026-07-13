import { LatLng } from '../../types';

export function transformPolygon(
  coordinate: number[][]
): { lat: number; lng: number }[] {
  return coordinate.slice(0, coordinate.length - 1).map((item: number[]) => {
    return { lat: item[1], lng: item[0] };
  });
}

export function transformPath(
  path: { lng: number; lat: number }[]
): number[][][] {
  const geometry: number[][] = path.map((coordinates) => {
    return [coordinates.lng, coordinates.lat];
  });
  geometry.push(geometry[0]);
  return [geometry];
}

export function calculatePolygonCentroid(coordinates: number[][]): LatLng {
  try {
    let area = 0;
    let centroidX = 0;
    let centroidY = 0;

    const n = coordinates.length;

    for (let i = 0; i < n - 1; i++) {
      const [x1, y1] = coordinates[i];
      const [x2, y2] = coordinates[i + 1];

      const step = x1 * y2 - x2 * y1;
      area += step;
      centroidX += (x1 + x2) * step;
      centroidY += (y1 + y2) * step;
    }

    // Close the polygon by adding the last point with the first one
    const [x1, y1] = coordinates[n - 1];
    const [x2, y2] = coordinates[0];
    const step = x1 * y2 - x2 * y1;
    area += step;
    centroidX += (x1 + x2) * step;
    centroidY += (y1 + y2) * step;

    // Finalize calculations
    area *= 0.5;
    centroidX /= 6 * area;
    centroidY /= 6 * area;

    return { lat: centroidY, lng: centroidX };
  } catch (err) {
    return { lat: 0, lng: 0 };
  }
}
