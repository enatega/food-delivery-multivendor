import { APP_MODES, type AppMode } from "./constants";

export interface ModeEnvironment {
  mode: AppMode;
  graphqlUrl: string;
  websocketUrl: string;
  restUrl: string;
  publicAccessRequired: boolean;
}

const withGraphql = (url = "") =>
  url.endsWith("/graphql") ? url : `${url.replace(/\/$/, "")}/graphql`;

const withTrailingSlash = (url = "") =>
  url ? `${url.replace(/\/$/, "")}/` : "";

export const isSingleVendorEnabled = () =>
  process.env.NEXT_PUBLIC_SINGLE_VENDOR_ENABLED === "true";

export const getModeEnvironment = (mode: AppMode): ModeEnvironment => {
  const single = mode === APP_MODES.SINGLE;
  const serverUrl = single
    ? process.env.NEXT_PUBLIC_SINGLE_VENDOR_SERVER_URL
    : process.env.NEXT_PUBLIC_SERVER_URL;
  const websocketUrl = single
    ? process.env.NEXT_PUBLIC_SINGLE_VENDOR_WS_SERVER_URL
    : process.env.NEXT_PUBLIC_WS_SERVER_URL;
  const restUrl = single
    ? process.env.NEXT_PUBLIC_SINGLE_VENDOR_REST_URL || serverUrl
    : serverUrl;

  return {
    mode,
    graphqlUrl: withGraphql(serverUrl),
    websocketUrl: withGraphql(websocketUrl),
    restUrl: withTrailingSlash(restUrl),
    publicAccessRequired: true,
  };
};
