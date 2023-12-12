// /*****************************
//  * environment.js
//  * path: '/environment.js' (root of your project)
//  ******************************/

import { useContext } from 'react'
import ConfigurationContext from './src/context/Configuration'

const useEnvVars = env => {
  const configuration = useContext(ConfigurationContext)

  if (env === 'production' || env === 'staging') {
    return {
      GRAPHQL_URL: 'https://enatega-multivendor.up.railway.app/graphql',
      WS_GRAPHQL_URL: 'wss://enatega-multivendor.up.railway.app/graphql',
      SERVER_URL: 'https://enatega-multivendor.up.railway.app/',
      IOS_CLIENT_ID_GOOGLE: configuration.iosClientIdGoogle,
      ANDROID_CLIENT_ID_GOOGLE: configuration.androidClientIdGoogle,
      AMPLITUDE_API_KEY: configuration.appAmplitudeApiKey,
      GOOGLE_MAPS_KEY: configuration.googleApiKey,
      EXPO_CLIENT_ID: configuration.expoClientId,
      SENTRY_DSN: configuration.customerAppSentryUrl,
      TERMS_AND_CONDITIONS: configuration.termsAndConditions,
      PRIVACY_POLICY: configuration.privacyPolicy,
      STRIPE_PUBLIC_KEY: 'pk_test_lEaBbVGnTkzja2FyFiNlbqtw',
      STRIPE_IMAGE_URL:
        'https://prod-enatega-single-api.herokuapp.com/assets/images/logo.png',
      STRIPE_STORE_NAME: 'Enatega',
      TEST_OTP: configuration.testOtp,
      GOOGLE_PACES_API_BASE_URL: configuration.googlePlacesApiBaseUrl
    }
  }
  return {
    GRAPHQL_URL: 'http://10.97.34.198:8001/graphql',
    WS_GRAPHQL_URL: 'ws://10.97.34.198:8001/graphql',
    SERVER_URL: 'http://10.97.34.198:8001/',
    IOS_CLIENT_ID_GOOGLE: configuration.iOSClientID,
    ANDROID_CLIENT_ID_GOOGLE: configuration.androidClientID,
    AMPLITUDE_API_KEY: configuration.appAmplitudeApiKey,
    GOOGLE_MAPS_KEY: configuration.googleApiKey,
    EXPO_CLIENT_ID: configuration.expoClientID,
    SENTRY_DSN: configuration.customerAppSentryUrl,
    TERMS_AND_CONDITIONS: configuration.termsAndConditions,
    PRIVACY_POLICY: configuration.privacyPolicy,
    STRIPE_PUBLIC_KEY: 'pk_test_lEaBbVGnTkzja2FyFiNlbqtw',
    STRIPE_IMAGE_URL:
      'https://prod-enatega-single-api.herokuapp.com/assets/images/logo.png',
    STRIPE_STORE_NAME: 'Enatega',
    TEST_OTP: configuration.testOtp,
    GOOGLE_PACES_API_BASE_URL: configuration.googlePlacesApiBaseUrl

    // IOS_CLIENT_ID_GOOGLE:
    //   '967541328677-30n1b9dljqadrr4badeku41980rf2dt1.apps.googleusercontent.com',
    // ANDROID_CLIENT_ID_GOOGLE:
    //   '967541328677-7264tf7tkdtoufk844rck9mimrve135c.apps.googleusercontent.com',
    // AMPLITUDE_API_KEY: '42b182f3d18a21e8ab0ae881c6ef475f',
    //GOOGLE_MAPS_KEY: 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA',
    // EXPO_CLIENT_ID:
    //   '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
    // SENTRY_DSN:
    //   'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933',
    // TERMS_AND_CONDITIONS:
    //   'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/terms',
    // PRIVACY_POLICY:
    //   'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/privacy',
    // STRIPE_PUBLIC_KEY: 'pk_test_lEaBbVGnTkzja2FyFiNlbqtw',
    // STRIPE_IMAGE_URL:
    //   'https://prod-enatega-single-api.herokuapp.com/assets/images/logo.png',
    // STRIPE_STORE_NAME: 'Enatega',
    // TEST_OTP: '111111',
    // GOOGLE_PACES_API_BASE_URL: 'https://maps.googleapis.com/maps/api/place'
  }
}

export default useEnvVars
