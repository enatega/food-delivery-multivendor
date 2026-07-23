/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

const getEnvVars = () => ({
  GRAPHQL_URL: "https://aws-server-v2.enatega.com/graphql",
  WS_GRAPHQL_URL: "wss://aws-server-v2.enatega.com/graphql",
});

export default getEnvVars;
