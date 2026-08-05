import { STORE_SERVER_MODES, StoreServerMode } from "@/lib/mode/store-mode";

export interface StoreEnvironment {
  GRAPHQL_URL: string;
  WS_GRAPHQL_URL: string;
  PUBLIC_ACCESS_REQUIRED: boolean;
}

const MULTI_VENDOR_ENVIRONMENT: StoreEnvironment = {
  GRAPHQL_URL: "https://aws-server-v2.enatega.com/graphql",
  WS_GRAPHQL_URL: "wss://aws-server-v2.enatega.com/graphql",
  PUBLIC_ACCESS_REQUIRED: true,
};

const SINGLE_VENDOR_DEFAULT_HOST = "3086ptqf-8001.inc1.devtunnels.ms";

const getSingleVendorEnvironment = (): StoreEnvironment => ({
  GRAPHQL_URL:
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_GRAPHQL_URL ??
    `https://${SINGLE_VENDOR_DEFAULT_HOST}/graphql`,
  WS_GRAPHQL_URL:
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_WS_GRAPHQL_URL ??
    `wss://${SINGLE_VENDOR_DEFAULT_HOST}/graphql`,
  PUBLIC_ACCESS_REQUIRED: false,
});

const getEnvVars = (
  mode: StoreServerMode = STORE_SERVER_MODES.MULTI,
): StoreEnvironment =>
  mode === STORE_SERVER_MODES.SINGLE
    ? getSingleVendorEnvironment()
    : MULTI_VENDOR_ENVIRONMENT;

export default getEnvVars;
