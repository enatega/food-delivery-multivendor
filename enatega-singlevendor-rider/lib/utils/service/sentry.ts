import * as Sentry from "@sentry/react-native";

// Sentry Handler
// Note: initSentry runs at module load (before React mounts) so it can't read
// ConfigurationContext/useEnvVars (those are hooks). The build type is derived
// from __DEV__, which mirrors environment.ts's own dev/prod split.
export const initSentry = () => {
  Sentry.init({
    dsn: "https://9303b1d33deae903abe4e00ea9f25467@o4507787652694016.ingest.us.sentry.io/4508759522017280",
    // Tag events by build so production crashes aren't mis-triaged as "development".
    environment: __DEV__ ? "development" : "production",
    debug: false,
    // Sample fewer transactions in production to cut cost/noise.
    tracesSampleRate: __DEV__ ? 0.3 : 0.1,
  });
};
