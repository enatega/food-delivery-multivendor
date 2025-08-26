import React, { useState, useEffect, useContext, useRef } from "react";
import * as Location from "expo-location";

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
  const [locationPermission, setLocationPermission] = useState(false);
  const [location, setLocation] = useState<ICoodinates>({} as ICoodinates);

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
        setLocation(currentLocation.coords as unknown as ICoodinates);
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
          distanceInterval: 1,
          timeInterval: 5000,
        },
        (location) => {
          setLocation({
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
          });
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
