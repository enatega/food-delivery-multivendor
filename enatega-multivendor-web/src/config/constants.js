/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import ConfigurationContext from "../../src/context/Configuration";
import { BACKEND_URLS } from "../utils/constantValues";

const ConfigurableValues = () => {
  const configuration = useContext(ConfigurationContext);

  const SERVER_URL = BACKEND_URLS.LIVE.SERVER_URL;
  const WS_SERVER_URL = BACKEND_URLS.LIVE.WS_SERVER_URL;

  
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
