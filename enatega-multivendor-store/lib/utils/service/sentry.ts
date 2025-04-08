import * as Sentry from "@sentry/react-native";

// Sentry Handler
export const initSentry = () => {
  console.log("Initializing Sentry");
  // if (!SENTRY_DSN) return;
  Sentry.init({
    dsn: "https://60cff3a30258576b838a539a21d4ed33@o4507787652694016.ingest.us.sentry.io/4508851535085568",
    environment: "development",
    debug: false,
    // enableTracing: false, // Disables tracing completely
    tracesSampleRate: 0.3, // Prevents sampling any traces
  });
};
