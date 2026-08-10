import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { Platform } from "react-native";

import {
  DEFAULT_RIDER_SERVER_MODE,
  RIDER_SERVER_MODES,
  RiderServerMode,
} from "@/lib/mode/rider-mode";

const MULTI_GRAPHQL_URL =
  process.env.EXPO_PUBLIC_GRAPHQL_URL ??
  // "https://aws-server-v2.enatega.com/graphql";
  "https://3086ptqf-8001.inc1.devtunnels.ms/graphql";
const MULTI_WS_GRAPHQL_URL =
  process.env.EXPO_PUBLIC_WS_GRAPHQL_URL ??
  // "wss://aws-server-v2.enatega.com/graphql";
  "wss://3086ptqf-8001.inc1.devtunnels.ms/graphql";
const SINGLE_GRAPHQL_URL =
  process.env.EXPO_PUBLIC_SINGLE_VENDOR_GRAPHQL_URL;
const SINGLE_WS_GRAPHQL_URL =
  process.env.EXPO_PUBLIC_SINGLE_VENDOR_WS_GRAPHQL_URL;

const singleVendorGraphqlUrl = () => {
  if (!__DEV__ && (!SINGLE_GRAPHQL_URL || !SINGLE_GRAPHQL_URL.startsWith("https://"))) {
    throw new Error("EXPO_PUBLIC_SINGLE_VENDOR_GRAPHQL_URL must use HTTPS in release builds.");
  }
  return SINGLE_GRAPHQL_URL ?? "http://localhost:8001/graphql";
};

const singleVendorWsUrl = () => {
  if (!__DEV__ && (!SINGLE_WS_GRAPHQL_URL || !SINGLE_WS_GRAPHQL_URL.startsWith("wss://"))) {
    throw new Error("EXPO_PUBLIC_SINGLE_VENDOR_WS_GRAPHQL_URL must use WSS in release builds.");
  }
  return SINGLE_WS_GRAPHQL_URL ?? "ws://localhost:8001/graphql";
};

let devMessagesLoaded = false;

export interface RiderEnvironment {
  GRAPHQL_URL: string;
  WS_GRAPHQL_URL: string;
  GOOGLE_MAPS_KEY: string | undefined;
  ENVIRONMENT: "development" | "production";
  PUBLIC_ACCESS_REQUIRED: boolean;
}

const getEnvVars = (
  mode: RiderServerMode = DEFAULT_RIDER_SERVER_MODE,
): RiderEnvironment => {
  if (__DEV__ && !devMessagesLoaded) {
    loadDevMessages();
    loadErrorMessages();
    devMessagesLoaded = true;
  }

  const isSingleVendor = mode === RIDER_SERVER_MODES.SINGLE;

  return {
    GRAPHQL_URL: isSingleVendor ? singleVendorGraphqlUrl() : MULTI_GRAPHQL_URL,
    WS_GRAPHQL_URL: isSingleVendor
      ? singleVendorWsUrl()
      : MULTI_WS_GRAPHQL_URL,
    GOOGLE_MAPS_KEY:
      Platform.OS === "ios"
        ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS
        : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID,
    ENVIRONMENT: __DEV__ ? "development" : "production",
    PUBLIC_ACCESS_REQUIRED: true,
  };
};

export default getEnvVars;
