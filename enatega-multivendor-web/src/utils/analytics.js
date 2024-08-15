/* eslint-disable import/no-anonymous-default-export */
import amplitude from "amplitude-js";

import { fetchConfiguration } from "../utils/helper";

//import ConfigurableValues from "../config/constants";
let isInitialized = false;
//const { AMPLITUDE_API_KEY } = ConfigurableValues();

//const AMPLITUDE_API_KEY  = "2114f5db4c014dc7ad4ed2ad747341b5";
let apiKey = "";

export const events = {
  USER_LOGGED_IN: "USER_LOGGED_IN",
  USER_CREATED_ACCOUNT: "USER_CREATED_ACCOUNT",
  USER_LOGGED_OUT: "USER_LOGGED_OUT",
  ADD_TO_CART: "ADD_TO_CART",
  ORDER_PLACED: "ORDER_PLACED",
  NAVIGATE_TO_HOME: "NAVIGATE_TO_HOME",
  NAVIGATE_TO_FAVOURITES: "NAVIGATE_TO_FAVOURITES",
  NAVIGATE_TO_FORGOT_PASSWORD: "NAVIGATE_TO_FORGOT_PASSWORD",
  NAVIGATE_TO_RESTAURANTS: "NAVIGATE_TO_RESTAURANTS",
  NAVIGATE_TO_RESTAURANTS_DETAIL: "NAVIGATE_TO_RESTAURANTS_DETAIL",
  NAVIGATE_TO_ORDER: "NAVIGATE_TO_ORDER",
  NAVIGATE_TO_ORDER_DETAIL: "NAVIGATE_TO_ORDER_DETAIL",
  NAVIGATE_TO_TERMS: "NAVIGATE_TO_TERMS",
  NAVIGATE_TO_PRIVACY_POLICY: "NAVIGATE_TO_PRIVACY_POLICY",
  NAVIGATE_TO_PROFILE: "NAVIGATE_TO_PROFILE",
  NAVIGATE_TO_STRIPE: "NAVIGATE_TO_STRIPE",
  NAVIGATE_TO_PAYPAL: "NAVIGATE_TO_PAYPAL",
};
export async function initialize() {
  if (isInitialized) {
    return;
  }

  const { webAmplitudeApiKey } = await fetchConfiguration();
  if (!webAmplitudeApiKey) {
    return;
  }

  apiKey = webAmplitudeApiKey;
  amplitude.getInstance().init(apiKey);
  isInitialized = true;
}

export async function identify(options, userId) {
  await initialize();
  // eslint-disable-next-line no-undef
  const properties = options;

  if (!apiKey) return;
  if (userId) {
    amplitude.setUserId(userId);
  }
  if (properties) {
    amplitude.getInstance().setUserProperties(properties);
  } else {
    amplitude.getInstance().clearUserProperties();
  }
}
export async function track(event, options) {
  await initialize();
  const properties = options;

  if (!apiKey) return;

  if (properties) {
    amplitude.getInstance().logEvent(event, properties);
  } else {
    amplitude.getInstance().logEvent(event);
  }
}

export default {
  events,
  initialize,
  identify,
  track,
};
