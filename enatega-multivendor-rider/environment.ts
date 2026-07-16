import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import * as Updates from "expo-updates";
import { Platform } from "react-native";
import {  useContext } from "react";
import { ConfigurationContext } from "./lib/context/global/configuration.context";
const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext);
  const googleMapsKey =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS
      : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;
  if (__DEV__) {
    loadDevMessages();
    loadErrorMessages();
  }
  if (!__DEV__) {
    return {
      GRAPHQL_URL: "https://aws-server-v2.enatega.com/graphql",
      WS_GRAPHQL_URL: "wss://aws-server-v2.enatega.com/graphql",
      SENTRY_DSN:
        configuration?.riderAppSentryUrl ??
        "https://e963731ba0f84e5d823a2bbe2968ea4d@o1103026.ingest.sentry.io/6135261",
      GOOGLE_MAPS_KEY: googleMapsKey,
      ENVIRONMENT: "production",
    };
  }

  return {
    GRAPHQL_URL: "https://aws-server-v2.enatega.com/graphql",
    WS_GRAPHQL_URL: "wss://aws-server-v2.enatega.com/graphql",
    SENTRY_DSN:
      configuration?.riderAppSentryUrl ??
      "https://e963731ba0f84e5d823a2bbe2968ea4d@o1103026.ingest.sentry.io/6135261",
    GOOGLE_MAPS_KEY: googleMapsKey,
    ENVIRONMENT: "development",
  };
};

export default getEnvVars;
