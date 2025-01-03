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
      GRAPHQL_URL: 'https://new-enatega-api-staging.up.railway.app/graphql',
      WS_GRAPHQL_URL: 'wss://new-enatega-api-staging.up.railway.app/graphql',
      SERVER_URL: 'https://new-enatega-api-staging.up.railway.app/',

      IOS_CLIENT_ID_GOOGLE: configuration.iOSClientID,
      ANDROID_CLIENT_ID_GOOGLE: configuration.androidClientID,
      AMPLITUDE_API_KEY: configuration.appAmplitudeApiKey,
      GOOGLE_MAPS_KEY: configuration.googleApiKey,
      EXPO_CLIENT_ID: configuration.expoClientID,
      SENTRY_DSN:
        configuration.customerAppSentryUrl ??
        'https://4160f777e00c18da9dcff59780b76cdb@o4506268211412992.ingest.us.sentry.io/4506274472919040',
      TERMS_AND_CONDITIONS: configuration.termsAndConditions,
      PRIVACY_POLICY: configuration.privacyPolicy,
      TEST_OTP: configuration.testOtp,
      GOOGLE_PACES_API_BASE_URL: configuration.googlePlacesApiBaseUrl
    }
  }

  return {
    GRAPHQL_URL: 'http://10.97.36.196/graphql',
    WS_GRAPHQL_URL: 'ws://10.97.36.196/graphql',
    SERVER_URL: 'http://10.97.36.196:8001/', 
    // GRAPHQL_URL: 'https://new-enatega-api-staging.up.railway.app/graphql',
    // WS_GRAPHQL_URL: 'wss://new-enatega-api-staging.up.railway.app/graphql',
    // SERVER_URL: 'https://new-enatega-api-staging.up.railway.app/',
    IOS_CLIENT_ID_GOOGLE: configuration.iOSClientID,
    ANDROID_CLIENT_ID_GOOGLE: configuration.androidClientID,
    AMPLITUDE_API_KEY: configuration.appAmplitudeApiKey,
    GOOGLE_MAPS_KEY: configuration.googleApiKey,
    EXPO_CLIENT_ID: configuration.expoClientID,
    SENTRY_DSN:
      configuration.customerAppSentryUrl ??
      //'https://4160f777e00c18da9dcff59780b76cdb@o4506268211412992.ingest.us.sentry.io/4506274472919040',
      'https://66d65088ec7a6e53ef75e7f37addf25f@o4507787652694016.ingest.us.sentry.io/4508211757842432',
    TERMS_AND_CONDITIONS: configuration.termsAndConditions,
    PRIVACY_POLICY: configuration.privacyPolicy,
    TEST_OTP: configuration.testOtp,
    GOOGLE_PACES_API_BASE_URL: configuration.googlePlacesApiBaseUrl
  }
}

export default useEnvVars
