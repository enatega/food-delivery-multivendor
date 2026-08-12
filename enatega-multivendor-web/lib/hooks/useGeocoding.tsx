import { reverseGeocode } from "../api/google-maps";
import { useAppMode } from "@/lib/mode";

interface GeocodingResult {
  formattedAddress: string;
  city: string | null;
}

const useGeocoding = () => {
  const { mode } = useAppMode();

  const getAddress = async (
    latitude: number,
    longitude: number,
  ): Promise<GeocodingResult> => {
    try {
      const data = await reverseGeocode({
        mode,
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
