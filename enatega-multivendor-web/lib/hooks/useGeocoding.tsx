import { useConfig } from "../context/configuration/configuration.context";
import { reverseGeocode } from "../api/google-maps";

interface GeocodingResult {
  formattedAddress: string;
  city: string | null;
}

const useGeocoding = () => {
  const { SERVER_URL } = useConfig();

  const getAddress = async (
    latitude: number,
    longitude: number
  ): Promise<GeocodingResult> => {
    try {
      const data = await reverseGeocode({
        serverUrl: SERVER_URL,
        latitude,
        longitude,
      });

      if (data.status === "OK" && data.formattedAddress) {
        return {
          formattedAddress: data.formattedAddress,
          city: data.city,
        };
      } else {
        throw new Error("No address found for the given coordinates.");
      }
    } catch (error: any) {
      console.error("Error fetching address:", error.message);
      throw error;
    }
  };

  return { getAddress };
};

export default useGeocoding;
