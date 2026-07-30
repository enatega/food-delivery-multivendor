// /*****************************
//  * environment.js
//  * path: '/environment.js' (root of your project)
//  ******************************/

import { useContext } from 'react'
import { Platform } from 'react-native'
import ConfigurationContext from './src/context/Configuration'
import * as Updates from 'expo-updates'
const { getEnvironmentConfig } = require('./environment.config')

const useEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext)
  const sharedConfig = getEnvironmentConfig(env)
  const googleMapsKey =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS
      : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID

  return {
    ...sharedConfig,
    IOS_CLIENT_ID_GOOGLE: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    ANDROID_CLIENT_ID_GOOGLE: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    AMPLITUDE_API_KEY: configuration?.appAmplitudeApiKey,
    GOOGLE_MAPS_KEY: googleMapsKey,
    EXPO_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // Sentry DSN must come from server configuration; no hardcoded fallback so a
    // leaked repo cannot be used to flood the Sentry project (SEC-010).
    SENTRY_DSN: configuration?.customerAppSentryUrl ?? null,
    TERMS_AND_CONDITIONS: configuration?.termsAndConditions,
    PRIVACY_POLICY: configuration?.privacyPolicy,
    TEST_OTP: configuration?.testOtp,
    GOOGLE_PACES_API_BASE_URL: configuration?.googlePlacesApiBaseUrl
  }
}

export default useEnvVars
