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
      GRAPHQL_URL: "https://aws-server-v2.enatega.com/graphql",
      WS_GRAPHQL_URL: "wss://aws-server-v2.enatega.com/graphql",

    };
  }
  return {
   
      GRAPHQL_URL: "https://aws-server-v2.enatega.com/graphql",
      WS_GRAPHQL_URL: "wss://aws-server-v2.enatega.com/graphql",


  };
};

export default getEnvVars;
