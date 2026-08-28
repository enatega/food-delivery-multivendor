import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import * as Location from "expo-location";
import { AppState } from "react-native";
import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
} from "react";

import {
  UPDATE_LOCATION,
  UPDATE_LOCATION_MULTI_VENDOR,
} from "@/lib/apollo/mutations/rider.mutation";
import getEnvVars from "@/environment";
import { getSecureItem } from "@/lib/services/secure-storage";
import PublicAccessTokenService from "@/lib/services/public-access-token.service";
import {
  startBackgroundLocation,
  stopBackgroundLocation,
} from "@/lib/services/background-location";
import { AuthContext } from "@/lib/context/global/auth.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { useRiderMode } from "@/lib/context/global/rider-mode.context";
import { RIDER_SERVER_MODES } from "@/lib/mode/rider-mode";

import {
  ICoodinates,
  ILocationContextProps,
  ILocationProviderProps,
} from "@/lib/utils/interfaces";

const LocationContext = React.createContext<ILocationContextProps>(
  {} as ILocationContextProps,
);

// No GPS watcher runs while the rider is idle. Active deliveries use a bounded
// high-accuracy profile for live customer and dispatcher tracking.
const ACTIVE_TRACKING_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.High,
  distanceInterval: 25,
  timeInterval: 10000,
};

type LastLocationFix = ICoodinates & { recordedAt: number };

const distanceMeters = (from: ICoodinates, to: ICoodinates) => {
  const fromLatitude = Number(from.latitude);
  const fromLongitude = Number(from.longitude);
  const toLatitude = Number(to.latitude);
  const toLongitude = Number(to.longitude);
  const radians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = radians(toLatitude - fromLatitude);
  const longitudeDelta = radians(toLongitude - fromLongitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(fromLatitude)) *
      Math.cos(radians(toLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const LocationProvider = ({ children }: ILocationProviderProps) => {
  const locationListener = useRef<Location.LocationSubscription | undefined>(
    undefined,
  );
  const previousLocationRef = useRef<LastLocationFix | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [backgroundLocationPermission, setBackgroundLocationPermission] =
    useState(false);
  const [
    isBackgroundLocationDisclosureVisible,
    setBackgroundDisclosureVisible,
  ] = useState(false);
  const [dismissedDeliveryKey, setDismissedDeliveryKey] = useState<
    string | null
  >(null);
  const [location, setLocation] = useState<ICoodinates>({} as ICoodinates);
  const client = useApolloClient();
  const { token } = useContext(AuthContext);
  const { tokenKey, mode } = useRiderMode();
  const isMultiVendor = mode === RIDER_SERVER_MODES.MULTI;
  const { assignedOrders, dataProfile } = useUserContext();

  // Rider is "actively delivering" when they own an order that's on the way.
  const activeDeliveryIds = useMemo(
    () =>
      (assignedOrders ?? [])
        .filter(
          (o: IOrder) =>
            (["ASSIGNED", "PICKED"].includes(o.orderStatus) ||
              ["PICKED_UP", "ON_ROUTE"].includes(o.orderState ?? "")) &&
            o.rider?._id === dataProfile?._id,
        )
        .map((order: IOrder) => order._id)
        .sort(),
    [assignedOrders, dataProfile?._id],
  );
  const activeDeliveryKey = activeDeliveryIds.join("|");
  const isActivelyDelivering = activeDeliveryIds.length > 0;

  const refreshBackgroundLocationPermission = useCallback(async () => {
    const { status } = await Location.getBackgroundPermissionsAsync();
    const granted = status === "granted";
    setBackgroundLocationPermission(granted);
    if (granted) {
      setBackgroundDisclosureVisible(false);
      setDismissedDeliveryKey(null);
    } else if (
      isActivelyDelivering &&
      dismissedDeliveryKey !== activeDeliveryKey
    ) {
      setBackgroundDisclosureVisible(true);
    }
    return granted;
  }, [activeDeliveryKey, dismissedDeliveryKey, isActivelyDelivering]);

  const requestBackgroundLocationPermission = useCallback(async () => {
    const foreground = await Location.getForegroundPermissionsAsync();
    if (foreground.status !== "granted") {
      setLocationPermission(false);
      setBackgroundDisclosureVisible(false);
      setDismissedDeliveryKey(activeDeliveryKey);
      return false;
    }

    const { status } = await Location.requestBackgroundPermissionsAsync();
    const granted = status === "granted";
    setBackgroundLocationPermission(granted);
    setBackgroundDisclosureVisible(false);
    if (!granted) {
      setDismissedDeliveryKey(activeDeliveryKey);
    }
    return granted;
  }, [activeDeliveryKey]);

  const dismissBackgroundLocationDisclosure = useCallback(() => {
    setDismissedDeliveryKey(activeDeliveryKey);
    setBackgroundDisclosureVisible(false);
  }, [activeDeliveryKey]);

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      // Bail out before getCurrentPositionAsync when permission isn't granted —
      // calling it without permission throws on iOS (the error was swallowed and
      // the location was never set). The LocationPermissionComp modal handles the
      // actual request; this only reads the current status.
      if (status !== "granted") {
        setLocationPermission(false);
        return;
      }
      setLocationPermission(true);

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
      if (__DEV__) {
        console.log("Error getting location: ", error);
      }
    }
  };

  const trackRiderLocation = useCallback(
    async (options: Location.LocationOptions, isCancelled: () => boolean) => {
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

            if ((nextLocation.coords.accuracy ?? Infinity) > 50) {
              return;
            }

            const previous = previousLocationRef.current;
            if (
              previous &&
              (nextLocation.timestamp - previous.recordedAt < 8000 ||
                distanceMeters(previous, nextCoordinates) < 20)
            )
              return;

            previousLocationRef.current = {
              ...nextCoordinates,
              recordedAt: nextLocation.timestamp,
            };

            try {
              const token = await getSecureItem(tokenKey);
              if (!token) return;

              await client.mutate({
                mutation: isMultiVendor
                  ? UPDATE_LOCATION_MULTI_VENDOR
                  : UPDATE_LOCATION,
                variables: {
                  ...nextCoordinates,
                  accuracy: nextLocation.coords.accuracy,
                  heading: nextLocation.coords.heading,
                  speed: nextLocation.coords.speed,
                  deviceTimestamp: new Date(
                    nextLocation.timestamp,
                  ).toISOString(),
                },
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
    },
    [client, isMultiVendor, locationPermission, tokenKey],
  );
  // Use Effect
  useEffect(() => {
    getLocationPermission();
  }, []);

  useEffect(() => {
    if (!locationPermission || !token || !isActivelyDelivering) {
      setBackgroundDisclosureVisible(false);
      if (!isActivelyDelivering) {
        setDismissedDeliveryKey(null);
      }
      return;
    }

    let cancelled = false;
    void Location.getBackgroundPermissionsAsync().then(({ status }) => {
      if (cancelled) return;
      const granted = status === "granted";
      setBackgroundLocationPermission(granted);
      setBackgroundDisclosureVisible(
        !granted && dismissedDeliveryKey !== activeDeliveryKey,
      );
    });

    return () => {
      cancelled = true;
    };
  }, [
    activeDeliveryKey,
    dismissedDeliveryKey,
    isActivelyDelivering,
    locationPermission,
    token,
  ]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && isActivelyDelivering) {
        void refreshBackgroundLocationPermission();
      }
    });
    return () => subscription.remove();
  }, [isActivelyDelivering, refreshBackgroundLocationPermission]);

  useEffect(() => {
    // Location sharing is active only while this rider owns an assigned or
    // picked order. No idle GPS watcher is kept alive.
    if (!locationPermission || !token || !isActivelyDelivering) {
      void stopBackgroundLocation();
      return;
    }

    let cancelled = false;
    trackRiderLocation(ACTIVE_TRACKING_OPTIONS, () => cancelled);

    if (backgroundLocationPermission) {
      const environment = getEnvVars(mode);
      void PublicAccessTokenService.getToken(
        client as ApolloClient<NormalizedCacheObject>,
      )
        .then((publicToken) =>
          startBackgroundLocation({
            graphqlUrl: environment.GRAPHQL_URL,
            tokenKey,
            publicToken,
            nonce: PublicAccessTokenService.getNonce(),
          }),
        )
        .catch((error) => {
          if (__DEV__)
            console.log("Unable to start background tracking", error);
        });
    } else {
      void stopBackgroundLocation();
    }

    return () => {
      cancelled = true;
      if (locationListener.current) {
        locationListener.current.remove();
        locationListener.current = undefined;
      }
      void stopBackgroundLocation();
    };
  }, [
    client,
    backgroundLocationPermission,
    isActivelyDelivering,
    isMultiVendor,
    locationPermission,
    mode,
    token,
    tokenKey,
    trackRiderLocation,
  ]);

  // Memoize the provider value so permission checks don't recreate the context
  // object unless a value exposed to consumers actually changes.
  const values = useMemo(
    () => ({
      locationPermission,
      setLocationPermission,
      location,
      isBackgroundLocationDisclosureVisible,
      requestBackgroundLocationPermission,
      dismissBackgroundLocationDisclosure,
    }),
    [
      dismissBackgroundLocationDisclosure,
      isBackgroundLocationDisclosureVisible,
      locationPermission,
      location,
      requestBackgroundLocationPermission,
    ],
  );

  return (
    <LocationContext.Provider value={values}>
      {children}
    </LocationContext.Provider>
  );
};

export const LocationConsumer = LocationContext.Consumer;
export const useLocationContext = () => useContext(LocationContext);
export default LocationContext;
