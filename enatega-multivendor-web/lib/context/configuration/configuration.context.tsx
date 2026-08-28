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
import { APP_MODES, getModeEnvironment, useAppMode } from "@/lib/mode";
import { SINGLE_VENDOR_CONFIGURATION } from "@/lib/api/graphql/single-vendor";

const ConfigurationContext = React.createContext({} as IConfigProps);
const GOOGLE_WEB_CLIENT_ID_REGEX =
  /^[a-zA-Z0-9-]+\.apps\.googleusercontent\.com$/;

export const ConfigurationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { mode, isSingleVendor } = useAppMode();
  const modeEnvironment = getModeEnvironment(mode);
  // Browser configuration is shared by both storefront modes. Only operational
  // API traffic (auth, catalog, cart, orders, etc.) follows the active mode.
  const sharedConfigurationQuery = useQuery(GET_CONFIG, {
    context: isSingleVendor ? { appMode: APP_MODES.MULTI } : undefined,
  });
  const singleVendorConfigurationQuery = useQuery(SINGLE_VENDOR_CONFIGURATION, {
    skip: !isSingleVendor,
  });
  const sharedConfiguration =
    sharedConfigurationQuery.loading ||
    sharedConfigurationQuery.error ||
    !sharedConfigurationQuery.data?.configuration
      ? { currency: "", currencySymbol: "", deliveryRate: 0, costType: "perKM" }
      : sharedConfigurationQuery.data.configuration;
  const commerceConfiguration = isSingleVendor
    ? singleVendorConfigurationQuery.data?.configuration || sharedConfiguration
    : sharedConfiguration;

  const configuredGoogleClientId = sharedConfiguration.webClientID;
  const GOOGLE_CLIENT_ID = GOOGLE_WEB_CLIENT_ID_REGEX.test(
    configuredGoogleClientId ?? "",
  )
    ? configuredGoogleClientId
    : "not_found";
  const STRIPE_PUBLIC_KEY = commerceConfiguration.publishableKey;
  const PAYPAL_KEY = sharedConfiguration.clientId;
  const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const AMPLITUDE_API_KEY = sharedConfiguration.webAmplitudeApiKey;
  const LIBRARIES = "places,drawing,geometry".split(",") as Libraries;
  const COLORS = {
    GOOGLE: sharedConfiguration.googleColor as string,
  };
  const SENTRY_DSN = sharedConfiguration.webSentryUrl;
  const SKIP_EMAIL_VERIFICATION = commerceConfiguration.skipEmailVerification;
  const SKIP_MOBILE_VERIFICATION = commerceConfiguration.skipMobileVerification;
  const CURRENCY = commerceConfiguration.currency;
  const CURRENCY_SYMBOL = commerceConfiguration.currencySymbol;
  const DELIVERY_RATE = commerceConfiguration.deliveryRate;
  const COST_TYPE = commerceConfiguration.costType;
  const TEST_OTP = sharedConfiguration.testOtp;

  const FIREBASE_KEY = sharedConfiguration?.firebaseKey;
  const FIREBASE_PROJECT_ID = sharedConfiguration?.projectId;
  const FIREBASE_STORAGE_BUCKET = sharedConfiguration?.storageBucket;
  const FIREBASE_MSG_SENDER_ID = sharedConfiguration?.msgSenderId;
  const FIREBASE_APP_ID = sharedConfiguration?.appId;
  const FIREBASE_MEASUREMENT_ID = sharedConfiguration?.measurementId;
  const FIREBASE_VAPID_KEY = sharedConfiguration?.vapidKey;
  const FIREBASE_AUTH_DOMAIN = sharedConfiguration?.authDomain;
  const SERVER_URL = modeEnvironment.restUrl;

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
        FIREBASE_AUTH_DOMAIN,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};
export const ConfigurationConsumer = ConfigurationContext.Consumer;
export const useConfig = () => useContext(ConfigurationContext);
