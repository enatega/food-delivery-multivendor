import { TPolygonPoints } from '../types';

export default function calculateZoom(distance: number): number {
  if (distance > 260) {
    return 10;
  } else if (distance > 200) {
    return 12;
  } else if (distance > 150) {
    return 12;
  } else if (distance > 100) {
    return 6;
  } else if (distance > 50) {
    return 6;
  } else if (distance > 40) {
    return 7;
  } else if (distance > 30) {
    return 7;
  } else if (distance > 20) {
    return 8;
  } else if (distance > 10) {
    return 8;
  } else if (distance > 5) {
    return 10;
  } else if (distance > 4) {
    return 11;
  } else if (distance > 3) {
    return 12;
  } else if (distance > 2) {
    return 12;
  } else if (distance > 1) {
    return 13;
  } else {
    return 14;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Avg
  const avg = (lat1 + lon1 + lat2 + lon2) / 4;
  const valid_map_distance = avg * 3;
  return valid_map_distance;
}

export function calculateZoomBasedOnCoordinates(
  coordinates: TPolygonPoints | number[][][]
): number {
  if (coordinates[0].length < 2) {
    return 5;
  }

  // Points
  const polygon_points = coordinates[0];
  const first_point = polygon_points[0];
  const last_point = polygon_points[polygon_points.length - 1];
  // Calculate distance b/w first & last points
  const distance = calculateDistance(
    first_point[0],
    first_point[1],
    last_point[0],
    last_point[1]
  );
  const zoomVal = calculateZoom(distance);
  console.log(zoomVal);
  return zoomVal;
}
