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
      GRAPHQL_URL: "https://enatega-multivendor-api-production-4216.up.railway.app/graphql",
      WS_GRAPHQL_URL: "wss://enatega-multivendor-api-production-4216.up.railway.app/graphql",

    };
  }
  return {
    GRAPHQL_URL: "https://enatega-multivendor-api-production-4216.up.railway.app/graphql",
    WS_GRAPHQL_URL: "wss://enatega-multivendor-api-production-4216.up.railway.app/graphql",
    // GRAPHQL_URL: "http://192.168.18.107:8001/graphql",
    // WS_GRAPHQL_URL: "ws://192.168.18.107:8001/graphql",


  };
};

export default getEnvVars;
