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
    SENTRY_DSN: configuration?.customerAppSentryUrl ?? 'https://4213c02977911e1b75898c93cc5517fb@o1103026.ingest.us.sentry.io/4508662470803456',
    TERMS_AND_CONDITIONS: configuration?.termsAndConditions,
    PRIVACY_POLICY: configuration?.privacyPolicy,
    TEST_OTP: configuration?.testOtp,
    GOOGLE_PACES_API_BASE_URL: configuration?.googlePlacesApiBaseUrl
  }
}

export default useEnvVars
