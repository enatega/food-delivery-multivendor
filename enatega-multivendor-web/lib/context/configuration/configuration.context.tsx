"use client";

// GQL
import { GET_CONFIG } from "@/lib/api/graphql/queries";

// Interfaces
import { IConfigProps } from "@/lib/utils/interfaces";

// Apollo
import { useQuery } from "@apollo/client";
import { Libraries } from "@react-google-maps/api";

// Core
import React, { ReactNode, useContext } from "react";

const ConfigurationContext = React.createContext({} as IConfigProps);
const GOOGLE_WEB_CLIENT_ID_REGEX =
  /^[a-zA-Z0-9-]+\.apps\.googleusercontent\.com$/;

export const ConfigurationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { loading, data, error } = useQuery(GET_CONFIG);
  const configuration =
    loading || error || !data.configuration ?
      { currency: "", currencySymbol: "", deliveryRate: 0, costType: "perKM" }
    : data.configuration;

  
  const GOOGLE_CLIENT_ID = GOOGLE_WEB_CLIENT_ID_REGEX.test(
    configuration.webClientID ?? "",
  )
    ? configuration.webClientID
    : "not_found";
  const STRIPE_PUBLIC_KEY = configuration.publishableKey;
  const PAYPAL_KEY = configuration.clientId;
  const GOOGLE_MAPS_KEY = configuration.googleMapsApiKey;
  const AMPLITUDE_API_KEY = configuration.webAmplitudeApiKey;
  const LIBRARIES = "places,drawing,geometry".split(",") as Libraries;
  const COLORS = {
    GOOGLE: configuration.googleColor as string,
  };
  const SENTRY_DSN = configuration.webSentryUrl;
  const SKIP_EMAIL_VERIFICATION = configuration.skipEmailVerification;
  const SKIP_MOBILE_VERIFICATION = configuration.skipMobileVerification;
  const CURRENCY = configuration.currency;
  const CURRENCY_SYMBOL = configuration.currencySymbol;
  const DELIVERY_RATE = configuration.deliveryRate;
  const COST_TYPE = configuration.costType;
  const TEST_OTP = configuration.testOtp;

  const FIREBASE_KEY = configuration?.firebaseKey;
  const FIREBASE_PROJECT_ID = configuration?.projectId;
  const FIREBASE_STORAGE_BUCKET = configuration?.storageBucket;
  const FIREBASE_MSG_SENDER_ID = configuration?.msgSenderId;
  const FIREBASE_APP_ID = configuration?.appId;
  const FIREBASE_MEASUREMENT_ID = configuration?.measurementId;
  const FIREBASE_VAPID_KEY = configuration?.vapidKey;
  const FIREBASE_AUTH_DOMAIN = configuration?.authDomain;
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

  return (
    <ConfigurationContext.Provider
      value={{
        GOOGLE_CLIENT_ID,
        STRIPE_PUBLIC_KEY,
        PAYPAL_KEY,
        GOOGLE_MAPS_KEY,
        AMPLITUDE_API_KEY,
        LIBRARIES,
        COLORS,
        SENTRY_DSN,
        SKIP_EMAIL_VERIFICATION,
        SKIP_MOBILE_VERIFICATION,
        CURRENCY,
        CURRENCY_SYMBOL,
        DELIVERY_RATE,
        COST_TYPE,
        TEST_OTP,
        SERVER_URL,
        FIREBASE_KEY,
        FIREBASE_APP_ID,
        FIREBASE_VAPID_KEY,
        FIREBASE_MEASUREMENT_ID,
        FIREBASE_MSG_SENDER_ID,
        FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET,
        FIREBASE_AUTH_DOMAIN

      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};
export const ConfigurationConsumer = ConfigurationContext.Consumer;
export const useConfig = () => useContext(ConfigurationContext);
