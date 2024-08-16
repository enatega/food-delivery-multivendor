/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import ConfigurationContext from "../../src/context/Configuration";

const ConfigurableValues = () => {
  const configuration = useContext(ConfigurationContext);

  const SERVER_URL = "https://enatega-multivendor.up.railway.app/";
  const WS_SERVER_URL = "wss://enatega-multivendor.up.railway.app/";
  //const SERVER_URL = 'http://192.168.100.15:8001/'
  //const WS_SERVER_URL = 'ws://192.168.100.15:8001/'

  
  const GOOGLE_CLIENT_ID = configuration?.webClientID;
  const STRIPE_PUBLIC_KEY = configuration?.publishableKey;
  const PAYPAL_KEY = configuration?.clientId;
  const GOOGLE_MAPS_KEY = configuration?.googleApiKey;
  const AMPLITUDE_API_KEY = configuration?.webAmplitudeApiKey;
  const LIBRARIES = "places,drawing,geometry,localContext,visualization".split(
    ","
  );
  const COLORS = {
    GOOGLE: configuration?.googleColor,
  };
  const SENTRY_DSN = configuration?.webSentryUrl;
  const SKIP_EMAIL_VERIFICATION = configuration?.skipEmailVerification;
  const SKIP_MOBILE_VERIFICATION = configuration?.skipMobileVerification;
  const VAPID_KEY = configuration?.vapidKey;

  return {
    SERVER_URL,
    WS_SERVER_URL,
    GOOGLE_CLIENT_ID,
    COLORS,
    PAYPAL_KEY,
    STRIPE_PUBLIC_KEY,
    GOOGLE_MAPS_KEY,
    AMPLITUDE_API_KEY,
    LIBRARIES,
    SENTRY_DSN,
    SKIP_EMAIL_VERIFICATION,
    SKIP_MOBILE_VERIFICATION,
    VAPID_KEY,
  };
};

export default ConfigurableValues;
