import axios from "axios";

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
  baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

export async function reverseGeocode({
  serverUrl,
  latitude,
  longitude,
}: {
  serverUrl: string;
  latitude: number;
  longitude: number;
}) {
  const response = await axios.get<IReverseGeocodeResponse>(
    `${normalizeBaseUrl(serverUrl)}/maps/reverse-geocode`,
    {
      params: {
        latitude,
        longitude,
        language: "en",
      },
      timeout: 10000,
    },
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(
      response.data.error?.message || "Unable to fetch address.",
    );
  }

  return response.data.data;
}
