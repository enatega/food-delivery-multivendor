"use client";
import { useLocationContext } from "@/lib/context/Location/Location.context";
import { GoogleMapsContext } from "@/lib/context/global/google-maps.context";
import useRestaurant from "@/lib/hooks/useRestaurant";
import { useCallback, useContext, useEffect, useState } from "react";
import useUser from "@/lib/hooks/useUser";
import { ILocation } from "@/lib/utils/interfaces/google.map.interface";
import { useUserAddress } from "@/lib/context/address/address.context";
import { onUseLocalStorage } from "@/lib/utils/methods/local-storage";

function useLocation() {
  // Hooks
  const { location, setLocation } = useLocationContext();
  const { userAddress } = useUserAddress();
  const { restaurant: restaurantId } = useUser();

 // Check if window is defined (client-side) before accessing localStorage
  const orderTrackingRestaurantId = typeof window !== 'undefined' 
  ? localStorage.getItem("orderTrackingRestaurantId") 
  : null;

  let effectiveRestaurantId = "";
  if(orderTrackingRestaurantId) {
    effectiveRestaurantId = orderTrackingRestaurantId;
  }else {
    effectiveRestaurantId = restaurantId || "";
  }

  const { data: restaurantData } = useRestaurant(effectiveRestaurantId);
  const { isLoaded } = useContext(GoogleMapsContext);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isCheckingCache, setIsCheckingCache] = useState(true);

  const origin = {
    lat: Number(restaurantData?.restaurant?.location.coordinates[1]) || 0,
    lng: Number(restaurantData?.restaurant?.location.coordinates[0]) || 0,
  };

  const destination = {
    lat: Number(userAddress?.location?.coordinates[1]) || 0,
    lng: Number(userAddress?.location?.coordinates[0]) || 0,
  };
  const store_user_location_cache_key = `${origin?.lat},${origin?.lng}_${destination?.lat},${destination?.lng}`;

  const directionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: string) => {
      if (status === "OK" && result) {
        setDirections(result);
        onUseLocalStorage(
          "save",
          store_user_location_cache_key,
          JSON.stringify(result)
        );
      } else {
        console.error("Directions request failed due to", status);
      }
    },
    []
  );

  useEffect(() => {
    if (!location) {
      const localStorageLocation = JSON.parse(
        localStorage.getItem("location") || "null"
      ) as ILocation;
      if (localStorageLocation) {
        setLocation(localStorageLocation);
      }
    }
  }, []);

  useEffect(() => {
  // This function runs when the component unmounts
  return () => {
     // This runs only on the client side
  if (typeof window !== 'undefined') {
    // Remove the item from local storage on unmount
    localStorage.removeItem("orderTrackingRestaurantId");
  }
}
}, []); // this effect runs once on mount and cleanup runs on unmount

  return {
    isLoaded,
    origin,
    directions,
    setDirections,
    isCheckingCache,
    setIsCheckingCache,
    destination,
    directionsCallback,
    store_user_location_cache_key,
  };
}

export default useLocation;
