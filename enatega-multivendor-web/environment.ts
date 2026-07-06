function normalizeUrl(url?: string): string {
  if (!url) return "";
  return url.endsWith("/") ? url : `${url}/`;
}

export default function getEnv(env: "DEV" | "STAGE" | "PROD") {
  const SERVER_URL = normalizeUrl(process.env.NEXT_PUBLIC_SERVER_URL);
  const WS_SERVER_URL = normalizeUrl(process.env.NEXT_PUBLIC_WS_SERVER_URL);

  switch (env) {
    case "DEV":
      return {
        SERVER_URL,
        WS_SERVER_URL,
      };
    case "STAGE":
      return {
        SERVER_URL,
        WS_SERVER_URL,
      };
    case "PROD":
      return {
        SERVER_URL,
        WS_SERVER_URL,
      };
    default:
      return {
        SERVER_URL,
        WS_SERVER_URL,
      };
  }
}
