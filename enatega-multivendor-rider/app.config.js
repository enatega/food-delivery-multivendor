const { expo } = require("./app.json");

const iosGoogleMapsApiKey =
  process.env.IOS_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
const androidGoogleMapsApiKey =
  process.env.ANDROID_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

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
