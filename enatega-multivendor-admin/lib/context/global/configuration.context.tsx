'use client';

// Core
import React, { useCallback, useEffect, useState } from 'react';

// Interfaces§
import {
  IConfiguration,
  IConfigurationContext,
  IConfigurationProviderProps,
  ILazyQueryResult,
} from '@/lib/utils/interfaces';

// API
import { GET_CONFIGURATION } from '@/lib/api/graphql';

// Hooks
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';

export const ConfigurationContext = React.createContext<
  IConfigurationContext | undefined
>({
  configuration: {
    _id: '',
    pushToken: '',
    webClientID: '',
    publishableKey: '',
    clientId: '',
    googleApiKey: '',
    webAmplitudeApiKey: '',
    appAmplitudeApiKey: '',
    googleColor: '',
    webSentryUrl: '',
    apiSentryUrl: '',
    customerAppSentryUrl: '',
    restaurantAppSentryUrl: '',
    riderAppSentryUrl: '',
    skipEmailVerification: false,
    skipMobileVerification: false,
    currency: '',
    currencySymbol: '',
    deliveryRate: 0,
    googleMapLibraries: '',
    twilioEnabled: false,
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    firebaseKey: '',
    appId: '',
    authDomain: '',
    storageBucket: '',
    msgSenderId: '',
    measurementId: '',
    projectId: '',
    dashboardSentryUrl: '',
    cloudinaryUploadUrl: '',
    cloudinaryApiKey: '',
    vapidKey: '',
    isPaidVersion: false,
    email: '',
    emailName: '',
    password: '',
    enableEmail: false,
    clientSecret: '',
    sandbox: false,
    secretKey: '',
    formEmail: '',
    sendGridApiKey: '',
    sendGridEnabled: false,
    sendGridEmail: '',
    sendGridEmailName: '',
    sendGridPassword: '',
    androidClientID: '',
    iOSClientID: '',
    expoClientID: '',
    termsAndConditions: '',
    privacyPolicy: '',
    testOtp: '',
    costType: '',
    enableRiderDemo: false,
    enableRestaurantDemo: false,
    enableAdminDemo: false,
    isMultiVendor: null,
    restaurantCount: null,
  },
  loading: false,
});

export const ConfigurationProvider: React.FC<IConfigurationProviderProps> = ({
  children,
}) => {
  const [configuration, setConfiguration] = useState<
    IConfiguration | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  // API

  const { fetch, loading, error, data } = useLazyQueryQL(GET_CONFIGURATION, {
    debounceMs: 300,
  }) as ILazyQueryResult<
    { configuration: IConfiguration } | undefined,
    undefined
  >;

  // Handlers
  const onFetchConfiguration = () => {
    try {
      const configuration: IConfiguration | undefined =
        loading || error || !data
          ? {
              _id: '',
              pushToken: '',
              webClientID: '',
              publishableKey: '',
              clientId: '',
              googleApiKey: '',
              webAmplitudeApiKey: '',
              appAmplitudeApiKey: '',
              googleColor: '',
              webSentryUrl: '',
              apiSentryUrl: '',
              customerAppSentryUrl: '',
              restaurantAppSentryUrl: '',
              riderAppSentryUrl: '',
              skipEmailVerification: false,
              skipMobileVerification: false,
              currency: '',
              currencySymbol: '',
              deliveryRate: 0,
              googleMapLibraries: '',
              twilioEnabled: false,
              twilioAccountSid: '',
              twilioAuthToken: '',
              twilioPhoneNumber: '',
              firebaseKey: '',
              appId: '',
              authDomain: '',
              storageBucket: '',
              msgSenderId: '',
              measurementId: '',
              projectId: '',
              dashboardSentryUrl: '',
              cloudinaryUploadUrl: '',
              cloudinaryApiKey: '',
              vapidKey: '',
              isPaidVersion: false,
              email: '',
              emailName: '',
              password: '',
              enableEmail: false,
              clientSecret: '',
              sandbox: false,
              secretKey: '',
              formEmail: '',
              sendGridApiKey: '',
              sendGridEnabled: false,
              sendGridEmail: '',
              sendGridEmailName: '',
              sendGridPassword: '',
              androidClientID: '',
              iOSClientID: '',
              expoClientID: '',
              termsAndConditions: '',
              privacyPolicy: '',
              testOtp: '',
              costType: '',
              enableRiderDemo: false,
              enableRestaurantDemo: false,
              enableAdminDemo: false,
              isMultiVendor: null,
              restaurantCount: null,
            }
          : data?.configuration;

      setConfiguration(configuration);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConfiguration = useCallback(() => {
    fetch();
  }, [fetch]);

  // Use Effect
  useEffect(() => {
    fetchConfiguration();
  }, []);

  useEffect(() => {
    onFetchConfiguration();
  }, [data]);

  const value = {
    configuration,
    loading: isLoading || loading,
  };

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
};
