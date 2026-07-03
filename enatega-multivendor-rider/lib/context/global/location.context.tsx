import { useApolloClient } from "@apollo/client";
import * as Location from "expo-location";
import React, { useState, useEffect, useContext, useRef } from "react";

import { UPDATE_LOCATION } from "@/lib/apollo/mutations/rider.mutation";
import { getSecureItem } from "@/lib/services/secure-storage";
import { RIDER_TOKEN } from "@/lib/utils/constants";

import {
  ICoodinates,
  ILocationContextProps,
  ILocationProviderProps,
} from "@/lib/utils/interfaces";

const LocationContext = React.createContext<ILocationContextProps>(
  {} as ILocationContextProps,
);

export const LocationProvider = ({ children }: ILocationProviderProps) => {
  const locationListener = useRef<Location.LocationSubscription>();
  const previousLocationRef = useRef<ICoodinates | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [location, setLocation] = useState<ICoodinates>({} as ICoodinates);
  const client = useApolloClient();

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
      }
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      if (currentLocation) {
        setLocation({
          latitude: currentLocation.coords.latitude.toString(),
          longitude: currentLocation.coords.longitude.toString(),
        });
      }
    } catch (error) {
      console.log("Error getting location: ", error);
    }
  };

  const trackRiderLocation = async () => {
    try {
      if (!locationPermission) return;

      locationListener.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 10,
          timeInterval: 60000,
        },
        async (nextLocation) => {
          const nextCoordinates = {
            latitude: nextLocation.coords.latitude.toString(),
            longitude: nextLocation.coords.longitude.toString(),
          };

          setLocation(nextCoordinates);

          if (
            previousLocationRef.current?.latitude === nextCoordinates.latitude &&
            previousLocationRef.current?.longitude === nextCoordinates.longitude
          ) {
            return;
          }

          previousLocationRef.current = nextCoordinates;

          try {
            const token = await getSecureItem(RIDER_TOKEN);
            if (!token) return;

            await client.mutate({
              mutation: UPDATE_LOCATION,
              variables: nextCoordinates,
            });
          } catch (mutationError) {
            console.log("Error updating location: ", mutationError);
          }
        },
      );
    } catch (error) {
      console.log("Error getting location: ", error);
      setLocationPermission(false);
    }
  };
  // Use Effect
  useEffect(() => {
    getLocationPermission();
  }, []);

  useEffect(() => {
    if (!locationPermission) return;

    trackRiderLocation();

    return () => {
      if (locationListener.current) {
        locationListener.current.remove();
      }
    };
  }, [locationPermission]);

  const values = {
    locationPermission,
    setLocationPermission,
    location,
  };

  return (
    <LocationContext.Provider value={values}>
      {children}
    </LocationContext.Provider>
  );
};

export const LocationConsumer = LocationContext.Consumer;
export const useLocationContext = () => useContext(LocationContext);
export default LocationContext;
