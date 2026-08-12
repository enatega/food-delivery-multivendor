import type {
  IOrderEta,
  IRiderTrackingLocation,
} from "@/lib/utils/interfaces/orders.interface";

export interface IMapCoordinate {
  lat: number;
  lng: number;
}

export function parseBackendDate(
  value?: string | number | Date | null,
): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const normalized =
    typeof value === "string" && /^\d+$/.test(value.trim())
      ? Number(value)
      : value;
  const timestamp =
    typeof normalized === "number" && normalized < 1e12
      ? normalized * 1000
      : normalized;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatEtaTime(
  value?: string | number | Date | null,
): string | null {
  const date = parseBackendDate(value);
  if (!date) return null;
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatEtaWindow(eta?: IOrderEta | null): string | null {
  const start = formatEtaTime(eta?.windowStartAt);
  const end = formatEtaTime(eta?.windowEndAt);
  return start && end ? `${start} – ${end}` : null;
}

export function isTrackingLocationStale(
  location?: IRiderTrackingLocation | null,
  eta?: IOrderEta | null,
  now = Date.now(),
): boolean {
  const recordedAt = parseBackendDate(
    location?.recordedAt || eta?.lastLocationAt,
  );
  return Boolean(recordedAt && now - recordedAt.getTime() > 90_000);
}

export function decodePolyline(encoded?: string | null): IMapCoordinate[] {
  if (!encoded) return [];

  const coordinates: IMapCoordinate[] = [];
  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    const decodeValue = () => {
      let result = 0;
      let shift = 0;
      let byte = 0;
      do {
        if (index >= encoded.length || shift > 30) return null;
        byte = encoded.charCodeAt(index++) - 63;
        if (byte < 0) return null;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      return result & 1 ? ~(result >> 1) : result >> 1;
    };

    const latitudeDelta = decodeValue();
    const longitudeDelta = decodeValue();
    if (latitudeDelta === null || longitudeDelta === null) return [];
    latitude += latitudeDelta;
    longitude += longitudeDelta;
    coordinates.push({ lat: latitude / 1e5, lng: longitude / 1e5 });
  }

  return coordinates;
}

export function trimPolylineToRider(
  coordinates: IMapCoordinate[],
  riderLocation?: IRiderTrackingLocation | null,
): IMapCoordinate[] {
  if (!coordinates.length || !riderLocation) return coordinates;
  const rider = {
    lat: riderLocation.latitude,
    lng: riderLocation.longitude,
  };
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  coordinates.forEach((coordinate, index) => {
    const distance =
      (coordinate.lat - rider.lat) ** 2 + (coordinate.lng - rider.lng) ** 2;
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return [rider, ...coordinates.slice(nearestIndex)];
}
