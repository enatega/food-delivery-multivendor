/* eslint-disable import/no-anonymous-default-export */
import amplitude from "amplitude-js";
//import ConfigurableValues from "../config/constants";
let isInitialized = false;
// const { AMPLITUDE_API_KEY } = ConfigurableValues();
const { AMPLITUDE_API_KEY } = "2114f5db4c014dc7ad4ed2ad747341b5";
const apiKey = AMPLITUDE_API_KEY;

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
  if (isInitialized || !apiKey) {
    return;
  }

  await amplitude.getInstance().init(apiKey);
  isInitialized = true;
}

export async function identify(options, userId) {
  initialize();
  // eslint-disable-next-line no-undef
  const properties = options;

  if (!apiKey) return;
  if (userId) {
    await amplitude.setUserId(userId);
  }
  if (properties) {
    await amplitude.getInstance().setUserProperties(properties);
  } else {
    await amplitude.getInstance().clearUserProperties();
  }
}
export async function track(event, options) {
  initialize();
  const properties = options;

  if (!apiKey) return;

  if (properties) {
    await amplitude.getInstance().logEvent(event, properties);
  } else {
    await amplitude.getInstance().logEvent(event);
  }
}

export default {
  events,
  initialize,
  identify,
  track,
};
