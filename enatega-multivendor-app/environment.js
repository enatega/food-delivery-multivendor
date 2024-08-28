// /*****************************
//  * environment.js
//  * path: '/environment.js' (root of your project)
//  ******************************/

import { useContext } from 'react'
import ConfigurationContext from './src/context/Configuration'
import * as Updates from 'expo-updates'
import { BACKEND_URL } from './src/utils/constants'

const useEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext)

  if (env === 'production' || env === 'staging') {
    return {
      ...BACKEND_URL.LIVE,
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
    ...BACKEND_URL.LIVE,
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
