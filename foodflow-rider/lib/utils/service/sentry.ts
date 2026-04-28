import * as Sentry from "@sentry/react-native";

// Sentry Handler
export const initSentry = () => {
  console.log("Initializing Sentry");
  // if (!SENTRY_DSN) return;
  Sentry.init({
    dsn: "https://9303b1d33deae903abe4e00ea9f25467@o4507787652694016.ingest.us.sentry.io/4508759522017280",
    environment: "development",
    debug: false,
    // enableTracing: false, // Disables tracing completely
    tracesSampleRate: 0.3, // Prevents sampling any traces
  });
};
