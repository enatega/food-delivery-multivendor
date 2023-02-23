/* eslint-disable react-hooks/exhaustive-deps */
import Geocode from "react-geocode";
import { GOOGLE_MAPS_KEY } from "../config/constants";
Geocode.setApiKey(GOOGLE_MAPS_KEY);
Geocode.setLanguage("en");
Geocode.enableDebug(false);
export default function useLocation() {
  const latLngToGeoString = async ({ latitude, longitude }) => {
    const location = await Geocode.fromLatLng(latitude, longitude);
    return location.results[0].formatted_address
  }
  const getCurrentLocation = (callback) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {

          const location = await Geocode.fromLatLng(latitude, longitude);
          callback(null, {
            label: "Home",
            latitude,
            longitude,
            deliveryAddress: location.results[0].formatted_address,
          })
          console.log(location)
        } catch (error) {
          callback(error)
        }

      },
      (error) => {
        callback(error.message)
        console.log(error.message)
      });
  }
  return {
    getCurrentLocation,
    latLngToGeoString
  };
}
