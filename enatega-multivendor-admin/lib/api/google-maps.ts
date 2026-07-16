interface IReverseGeocodeResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
  } | null;
  data: {
    status: string;
    errorMessage: string | null;
    formattedAddress: string | null;
    city: string | null;
  } | null;
}

const normalizeBaseUrl = (baseUrl: string): string =>
  baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

export async function reverseGeocode({
  serverUrl,
  latitude,
  longitude,
}: {
  serverUrl: string;
  latitude: number;
  longitude: number;
}) {
  const response = await fetch(
    `${normalizeBaseUrl(serverUrl)}/maps/reverse-geocode?${new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      language: 'en',
    }).toString()}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );

  const payload: IReverseGeocodeResponse = await response.json();

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error?.message || 'Unable to fetch address.');
  }

  return payload.data;
}
