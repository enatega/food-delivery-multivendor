import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";

import { getSecureItem } from "@/lib/services/secure-storage";

export const RIDER_LOCATION_TASK = "RIDER_LOCATION";
const CONFIG_KEY = "rider.background-location.config.v1";
const LAST_FIX_KEY = "rider.background-location.last-fix.v1";

type BackgroundConfig = {
  graphqlUrl: string;
  tokenKey: string;
  publicToken?: string | null;
  nonce?: string | null;
};

type StoredFix = {
  latitude: number;
  longitude: number;
  recordedAt: number;
};

const distanceMeters = (from: StoredFix, to: StoredFix) => {
  const radians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const transmitLocation = async (
  config: BackgroundConfig,
  location: Location.LocationObject,
) => {
  if ((location.coords.accuracy ?? Infinity) > 50) return;
  const nextFix: StoredFix = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    recordedAt: location.timestamp,
  };
  const stored = await AsyncStorage.getItem(LAST_FIX_KEY);
  const previous = stored ? (JSON.parse(stored) as StoredFix) : null;
  if (
    previous &&
    (nextFix.recordedAt - previous.recordedAt < 8000 ||
      distanceMeters(previous, nextFix) < 20)
  ) {
    return;
  }

  const token = await getSecureItem(config.tokenKey);
  if (!token) return;
  const locale = (await AsyncStorage.getItem("lang")) || "en";
  const headers = (publicToken = config.publicToken) => ({
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
    "x-platform": Platform.OS,
    "accept-language": locale,
    "user-agent": `Enatega-Rider-App/${Platform.OS}`,
    ...(publicToken ? {"bop-auth": `Bearer ${publicToken}`} : {}),
    ...(config.nonce ? {nonce: config.nonce} : {}),
  });
  const requestBody = JSON.stringify({
    query: `mutation BackgroundRiderLocation($latitude: String!, $longitude: String!, $accuracy: Float, $heading: Float, $speed: Float, $deviceTimestamp: String) { updateRiderLocation(latitude: $latitude, longitude: $longitude, accuracy: $accuracy, heading: $heading, speed: $speed, deviceTimestamp: $deviceTimestamp) { _id } }`,
    variables: {
      latitude: String(location.coords.latitude),
      longitude: String(location.coords.longitude),
      accuracy: location.coords.accuracy,
      heading: location.coords.heading,
      speed: location.coords.speed,
      deviceTimestamp: new Date(location.timestamp).toISOString(),
    },
  });
  const send = async (publicToken = config.publicToken) => {
    const response = await fetch(config.graphqlUrl, {
      method: "POST",
      headers: headers(publicToken),
      body: requestBody,
    });
    return {response, payload: await response.json()};
  };
  let {response, payload} = await send();
  if (payload.errors?.length && config.nonce) {
    const tokenResponse = await fetch(config.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-platform": Platform.OS,
        "accept-language": locale,
        "user-agent": `Enatega-Rider-App/${Platform.OS}`,
        nonce: config.nonce,
      },
      body: JSON.stringify({
        query: "mutation BackgroundPublicToken { metricsGeneral { experience hehe } }",
      }),
    });
    const tokenPayload = await tokenResponse.json();
    const refreshedToken = tokenPayload.data?.metricsGeneral?.experience;
    if (refreshedToken) {
      config.publicToken = refreshedToken;
      await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      ({response, payload} = await send(refreshedToken));
    }
  }
  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message || "Background location failed");
  }
  await AsyncStorage.setItem(LAST_FIX_KEY, JSON.stringify(nextFix));
};

TaskManager.defineTask(RIDER_LOCATION_TASK, async ({data, error}) => {
  if (error || !data) return;
  const storedConfig = await AsyncStorage.getItem(CONFIG_KEY);
  if (!storedConfig) return;
  const config = JSON.parse(storedConfig) as BackgroundConfig;
  const locations = (data as {locations?: Location.LocationObject[]}).locations;
  const latest = locations?.[locations.length - 1];
  if (!latest) return;
  try {
    await transmitLocation(config, latest);
  } catch (taskError) {
    if (__DEV__) console.log("Background location update failed", taskError);
  }
});

export const startBackgroundLocation = async (config: BackgroundConfig) => {
  await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  const foreground = await Location.getForegroundPermissionsAsync();
  if (foreground.status !== "granted") return false;
  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== "granted") return false;
  if (await Location.hasStartedLocationUpdatesAsync(RIDER_LOCATION_TASK)) {
    return true;
  }
  await Location.startLocationUpdatesAsync(RIDER_LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    distanceInterval: 25,
    timeInterval: 10000,
    pausesUpdatesAutomatically: false,
    activityType: Location.ActivityType.AutomotiveNavigation,
    deferredUpdatesDistance: 25,
    deferredUpdatesInterval: 10000,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Enatega delivery tracking",
      notificationBody: "Sharing your location for active deliveries",
      killServiceOnDestroy: false,
    },
  });
  return true;
};

export const stopBackgroundLocation = async () => {
  if (await Location.hasStartedLocationUpdatesAsync(RIDER_LOCATION_TASK)) {
    await Location.stopLocationUpdatesAsync(RIDER_LOCATION_TASK);
  }
  await AsyncStorage.removeItem(CONFIG_KEY);
};
