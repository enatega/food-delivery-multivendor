'use client';

// Core
import React, { useCallback, useEffect, useState } from 'react';

// Interfaces§
import {
  IConfiguration,
  IConfigurationProviderProps,
  ILazyQueryResult,
} from '@/lib/utils/interfaces';

// API
import { GET_CONFIGURATION } from '@/lib/api/graphql';

// Hooks
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';
import { decryptConfigFields } from '@/lib/utils/methods/decryption/decrypt-config-fields';

export const ConfigurationContext = React.createContext<
  IConfiguration | null | undefined
>({
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
  skipWhatsAppOTP: false,
  currency: '',
  currencySymbol: '',
  deliveryRate: 0,
  googleMapLibraries: '',
  twilioEnabled: false,
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioPhoneNumber: '',
  twilioWhatsAppNumber: '',
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
});

export const ConfigurationProvider: React.FC<IConfigurationProviderProps> = ({
  children,
}) => {
  const [configuration, setConfiguration] = useState<
    IConfiguration | null | undefined
  >();
  // API

  const { fetch, loading, error, data } = useLazyQueryQL(GET_CONFIGURATION, {
    debounceMs: 300,
  }) as ILazyQueryResult<
    { configuration: IConfiguration } | undefined,
    undefined
  >;

  // Handlers
  const onFetchConfiguration = async () => {
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
          }
        : data?.configuration;
    const decryptedConfiguration = await decryptConfigFields(configuration);
    console.log('Decrypted Configuration:', decryptedConfiguration);
    setConfiguration(decryptedConfiguration);
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

  return (
    <ConfigurationContext.Provider value={configuration}>
      {children}
    </ConfigurationContext.Provider>
  );
};
