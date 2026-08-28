import type { AppMode } from "@/lib/mode";

interface IReverseGeocodeResponse {
  success: boolean;
  error: { code: string; message: string } | null;
  data: {
    status: string;
    errorMessage: string | null;
    formattedAddress: string | null;
    city: string | null;
  } | null;
}

export async function reverseGeocode({
  mode,
  latitude,
  longitude,
}: {
  mode: AppMode;
  latitude: number;
  longitude: number;
}) {
  const params = new URLSearchParams({
    mode,
    latitude: String(latitude),
    longitude: String(longitude),
    language: "en",
  });
  const response = await fetch(`/api/maps/reverse-geocode?${params}`, {
    signal: AbortSignal.timeout(10000),
  });
  const payload = (await response.json()) as IReverseGeocodeResponse;

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message || "Unable to fetch address.");
  }

  return payload.data;
}
