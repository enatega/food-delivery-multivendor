import axios from "axios";
import { useConfig } from "../context/configuration/configuration.context";

interface GeocodingResult {
  formattedAddress: string;
  city: string | null;
}

interface GoogleGeocodingResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      long_name: string;
      types: string[];
    }>;
  }>;
  status: string;
}

const useGeocoding = () => {
  const { GOOGLE_MAPS_KEY } = useConfig();

  const getAddress = async (
    latitude: number,
    longitude: number
  ): Promise<GeocodingResult> => {
    try {
      const response = await axios.get<GoogleGeocodingResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_KEY}&language=en`
      );

      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const firstResult = response.data.results[0];
        const formattedAddress = firstResult.formatted_address;

        const cityComponent = firstResult.address_components.find(
          (component) =>
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_2")
        );

        const city = cityComponent ? cityComponent.long_name : null;

        return { formattedAddress, city };
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
