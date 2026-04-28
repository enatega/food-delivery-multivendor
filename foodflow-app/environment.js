// /*****************************
//  * environment.js
//  * path: '/environment.js' (root of your project)
//  ******************************/

import { useContext } from 'react'
import ConfigurationContext from './src/context/Configuration'
import * as Updates from 'expo-updates'

const useEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext)
  
  // Production URLs - pointing to Render backend
  const BACKEND_URL = 'https://foodflow-2h6z.onrender.com'
  
  if (env === 'production' || env === 'staging') {
    return {
      GRAPHQL_URL: `${BACKEND_URL}/graphql`,
      WS_GRAPHQL_URL: `wss://${BACKEND_URL}/graphql`,
      SERVER_URL: `${BACKEND_URL}/`,
      SERVER_REST_URL: `${BACKEND_URL}/`,
      API_BASE_URL: BACKEND_URL,
      IOS_CLIENT_ID_GOOGLE: configuration?.iOSClientID,
      ANDROID_CLIENT_ID_GOOGLE: configuration?.androidClientID,
      AMPLITUDE_API_KEY: configuration?.appAmplitudeApiKey,
      GOOGLE_MAPS_KEY: configuration?.googleApiKey,
      EXPO_CLIENT_ID: configuration?.expoClientID,
      SENTRY_DSN: configuration?.customerAppSentryUrl ?? 'https://4213c02977911e1b75898c93cc5517fb@o1103026.ingest.us.sentry.io/4508662470803456',
      TERMS_AND_CONDITIONS: configuration?.termsAndConditions,
      PRIVACY_POLICY: configuration?.privacyPolicy,
      TEST_OTP: configuration?.testOtp,
      GOOGLE_PACES_API_BASE_URL: configuration?.googlePlacesApiBaseUrl
    }
  }

  // Development URLs
  return {
    GRAPHQL_URL: `${BACKEND_URL}/graphql`,
    WS_GRAPHQL_URL: `wss://${BACKEND_URL}/graphql`,
    SERVER_URL: `${BACKEND_URL}/`,
    SERVER_REST_URL: `${BACKEND_URL}/`,
    API_BASE_URL: BACKEND_URL,
    IOS_CLIENT_ID_GOOGLE: configuration?.iOSClientID,
    ANDROID_CLIENT_ID_GOOGLE: configuration?.androidClientID,
    AMPLITUDE_API_KEY: configuration?.appAmplitudeApiKey,
    GOOGLE_MAPS_KEY: configuration?.googleApiKey,
    EXPO_CLIENT_ID: configuration?.expoClientID,
    SENTRY_DSN: configuration?.customerAppSentryUrl ?? 'https://4213c02977911e1b75898c93cc5517fb@o1103026.ingest.us.sentry.io/4508662470803456',
    TERMS_AND_CONDITIONS: configuration?.termsAndConditions,
    PRIVACY_POLICY: configuration?.privacyPolicy,
    TEST_OTP: configuration?.testOtp,
    GOOGLE_PACES_API_BASE_URL: configuration?.googlePlacesApiBaseUrl
  }
}

export default useEnvVars
