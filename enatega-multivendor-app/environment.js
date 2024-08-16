// /*****************************
//  * environment.js
//  * path: '/environment.js' (root of your project)
//  ******************************/

import { useContext } from 'react'
import ConfigurationContext from './src/context/Configuration'
import * as Updates from 'expo-updates'

const useEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext)

  if (env === 'production' || env === 'staging') {
    return {
      GRAPHQL_URL: 'https://enatega-multivendor.up.railway.app/graphql',
      WS_GRAPHQL_URL: 'wss://enatega-multivendor.up.railway.app/graphql',
      SERVER_URL: 'https://enatega-multivendor.up.railway.app/',
      IOS_CLIENT_ID_GOOGLE: configuration.iOSClientID,
      ANDROID_CLIENT_ID_GOOGLE: configuration.androidClientID,
      AMPLITUDE_API_KEY: configuration.appAmplitudeApiKey,
      GOOGLE_MAPS_KEY: configuration.googleApiKey,
      EXPO_CLIENT_ID: configuration.expoClientId,
      SENTRY_DSN: configuration.customerAppSentryUrl,
      TERMS_AND_CONDITIONS: configuration.termsAndConditions,
      PRIVACY_POLICY: configuration.privacyPolicy,
      TEST_OTP: configuration.testOtp,
      GOOGLE_PACES_API_BASE_URL: configuration.googlePlacesApiBaseUrl
    }
  }

  return {
    GRAPHQL_URL: 'https://enatega-multivendor.up.railway.app/graphql',
    WS_GRAPHQL_URL: 'wss://enatega-multivendor.up.railway.app/graphql',
    SERVER_URL: 'https://enatega-multivendor.up.railway.app/',
    // GRAPHQL_URL: 'http://10.97.25.37:8001/graphql',
    // WS_GRAPHQL_URL: 'ws://10.97.25.37:8001/graphql',
    // SERVER_URL: 'http://10.97.25.37:8001/',
    IOS_CLIENT_ID_GOOGLE: configuration.iOSClientID,
    ANDROID_CLIENT_ID_GOOGLE: configuration.androidClientID,
    AMPLITUDE_API_KEY: configuration.appAmplitudeApiKey,
    GOOGLE_MAPS_KEY: configuration.googleApiKey,
    EXPO_CLIENT_ID: configuration.expoClientID,
    SENTRY_DSN: configuration.customerAppSentryUrl,
    TERMS_AND_CONDITIONS: configuration.termsAndConditions,
    PRIVACY_POLICY: configuration.privacyPolicy,
    TEST_OTP: configuration.testOtp,
    GOOGLE_PACES_API_BASE_URL: configuration.googlePlacesApiBaseUrl
  }
}

export default useEnvVars
