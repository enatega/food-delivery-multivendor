/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import * as Updates from "expo-updates";
import { useContext } from "react";
import { ConfigurationContext } from "./lib/context/global/configuration.context";

const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext);

  if (env === "production" || env === "staging") {
    return {
      GRAPHQL_URL: "https://aws-server.enatega.com/graphql",
      WS_GRAPHQL_URL: "wss://aws-server.enatega.com/graphql",
      SENTRY_DSN:
        configuration?.restaurantAppSentryUrl ??
        "https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933",
    };
  }
  return {
   
      GRAPHQL_URL: "https://aws-server.enatega.com/graphql",
      WS_GRAPHQL_URL: "wss://aws-server.enatega.com/graphql",
      // GRAPHQL_URL: "http://192.168.18.107:8001/graphql",
      // WS_GRAPHQL_URL: "ws://192.168.18.107:8001/graphql",

    SENTRY_DSN:
      configuration?.restaurantAppSentryUrl ??
      "https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933",
  };
};

export default getEnvVars;
