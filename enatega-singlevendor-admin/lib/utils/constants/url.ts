// Self-hosted backend (enatega-multivendor-api): set NEXT_PUBLIC_SERVER_URL (https://api.example.com/)
// and NEXT_PUBLIC_WS_SERVER_URL (wss://api.example.com/). Both must end with a slash.
const withSlash = (url: string) => (url.endsWith('/') ? url : `${url}/`);
const SERVER_URL_OVERRIDE = process.env.NEXT_PUBLIC_SERVER_URL
  ? withSlash(process.env.NEXT_PUBLIC_SERVER_URL)
  : undefined;
const WS_SERVER_URL_OVERRIDE = process.env.NEXT_PUBLIC_WS_SERVER_URL
  ? withSlash(process.env.NEXT_PUBLIC_WS_SERVER_URL)
  : SERVER_URL_OVERRIDE?.replace(/^http/, 'ws');

const DEFAULT_BACKEND_URL = {
  LOCAL: {
    SERVER_URL:
      'https://enatega-multivendor-api-production-9b09.up.railway.app/',
    WS_SERVER_URL:
      'wss://enatega-multivendor-api-production-9b09.up.railway.app/',
  },
  LIVE: {
    SERVER_URL:
      'https://enatega-multivendor-api-production-9b09.up.railway.app/',
    WS_SERVER_URL:
      'wss://enatega-multivendor-api-production-9b09.up.railway.app/',
  },
};

export const BACKEND_URL = SERVER_URL_OVERRIDE
  ? {
      LOCAL: { SERVER_URL: SERVER_URL_OVERRIDE, WS_SERVER_URL: WS_SERVER_URL_OVERRIDE! },
      LIVE: { SERVER_URL: SERVER_URL_OVERRIDE, WS_SERVER_URL: WS_SERVER_URL_OVERRIDE! },
    }
  : DEFAULT_BACKEND_URL;
