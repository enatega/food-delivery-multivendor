const { expo } = require("./app.json");

// Fallback so the native Maps key is always baked into the build even when the
// env vars aren't set. Replace with your own key restricted to this app's
// package/bundle id (com.enatega.multirider). A rebuild is required after change.
const FALLBACK_GOOGLE_MAPS_API_KEY = "AIzaSyCcm7_Wd7uvmC9YnYLu2JHGWPt6z1MaL1E";

const iosGoogleMapsApiKey =
  process.env.IOS_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  FALLBACK_GOOGLE_MAPS_API_KEY;
const androidGoogleMapsApiKey =
  process.env.ANDROID_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  FALLBACK_GOOGLE_MAPS_API_KEY;

module.exports = {
  ...expo,
  ios: {
    ...expo.ios,
    config: {
      ...expo.ios.config,
      ...(iosGoogleMapsApiKey
        ? { googleMapsApiKey: iosGoogleMapsApiKey }
        : {}),
    },
  },
  android: {
    ...expo.android,
    config: {
      ...expo.android.config,
      googleMaps: {
        ...(expo.android.config?.googleMaps || {}),
        ...(androidGoogleMapsApiKey
          ? { apiKey: androidGoogleMapsApiKey }
          : {}),
      },
    },
  },
};
