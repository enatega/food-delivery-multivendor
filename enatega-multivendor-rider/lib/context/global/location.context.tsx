import { useApolloClient } from "@apollo/client";
import * as Location from "expo-location";
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
} from "react";

import { UPDATE_LOCATION } from "@/lib/apollo/mutations/rider.mutation";
import { getSecureItem } from "@/lib/services/secure-storage";
import { RIDER_TOKEN } from "@/lib/utils/constants";
import { AuthContext } from "@/lib/context/global/auth.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

import {
  ICoodinates,
  ILocationContextProps,
  ILocationProviderProps,
} from "@/lib/utils/interfaces";

const LocationContext = React.createContext<ILocationContextProps>(
  {} as ILocationContextProps,
);

// Adaptive GPS profiles: keep the chip in high-accuracy mode only while the
// rider is actively delivering; drop to a light profile when idle to save
// battery instead of running BestForNavigation continuously.
const ACTIVE_TRACKING_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.High,
  distanceInterval: 10,
  timeInterval: 30000,
};

const IDLE_TRACKING_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: 50,
  timeInterval: 60000,
};

export const LocationProvider = ({ children }: ILocationProviderProps) => {
  const locationListener = useRef<Location.LocationSubscription | undefined>(
    undefined,
  );
  const previousLocationRef = useRef<ICoodinates | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [location, setLocation] = useState<ICoodinates>({} as ICoodinates);
  const client = useApolloClient();
  const { token } = useContext(AuthContext);
  const { assignedOrders, dataProfile } = useUserContext();

  // Rider is "actively delivering" when they own an order that's on the way.
  const isActivelyDelivering = useMemo(
    () =>
      (assignedOrders ?? []).some(
        (o: IOrder) =>
          ["ASSIGNED", "PICKED"].includes(o.orderStatus) &&
          o.rider?._id === dataProfile?._id,
      ),
    [assignedOrders, dataProfile?._id],
  );

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermission(true);
      }
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
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

  const trackRiderLocation = async (
    options: Location.LocationOptions,
    isCancelled: () => boolean,
  ) => {
    try {
      if (!locationPermission) return;

      const listener = await Location.watchPositionAsync(
        options,
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

      // The effect may have been torn down while watchPositionAsync was
      // awaiting; if so, remove the listener now to avoid leaking a watcher.
      if (isCancelled()) {
        listener.remove();
        return;
      }

      locationListener.current = listener;
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
    // Only track once the rider is logged in and has granted permission.
    if (!locationPermission || !token) return;

    let cancelled = false;
    trackRiderLocation(
      isActivelyDelivering ? ACTIVE_TRACKING_OPTIONS : IDLE_TRACKING_OPTIONS,
      () => cancelled,
    );

    return () => {
      cancelled = true;
      if (locationListener.current) {
        locationListener.current.remove();
        locationListener.current = undefined;
      }
    };
  }, [locationPermission, token, isActivelyDelivering]);

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
