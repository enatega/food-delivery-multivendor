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
      GRAPHQL_URL: "https://enatega-api-staging-production.up.railway.app/graphql",
      WS_GRAPHQL_URL: "wss://enatega-api-staging-production.up.railway.app/graphql", 

    };
  }
  return {
   
      GRAPHQL_URL: "https://enatega-api-staging-production.up.railway.app/graphql",
      WS_GRAPHQL_URL: "wss://enatega-api-staging-production.up.railway.app/graphql",


  };
};

export default getEnvVars;
