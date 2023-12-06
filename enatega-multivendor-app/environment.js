/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import * as Updates from 'expo-updates'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { getConfiguration } from './src/apollo/queries'

const GETCONFIGURATION = gql`
  ${getConfiguration}
`

// const ENV = {
//   development: {
//     GRAPHQL_URL: 'https://enatega-multivendor.up.railway.app/graphql',
//     WS_GRAPHQL_URL: 'wss://enatega-multivendor.up.railway.app/graphql',
//     SERVER_URL: 'https://enatega-multivendor.up.railway.app/', // put / at the end of server url

//     IOS_CLIENT_ID_GOOGLE:
//       '967541328677-30n1b9dljqadrr4badeku41980rf2dt1.apps.googleusercontent.com',
//     ANDROID_CLIENT_ID_GOOGLE:
//       '967541328677-7264tf7tkdtoufk844rck9mimrve135c.apps.googleusercontent.com',
//     AMPLITUDE_API_KEY: '2114f5db4c014dc7ad4ed2ad747341b5',
//     GOOGLE_MAPS_KEY: 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA',
//     EXPO_CLIENT_ID:
//       '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
//     SENTRY_DSN:
//       'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933',
//     TERMS_AND_CONDITIONS:
//       'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/terms',
//     PRIVACY_POLICY:
//       'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/privacy',
//     STRIPE_PUBLIC_KEY: 'pk_test_lEaBbVGnTkzja2FyFiNlbqtw',

//     STRIPE_IMAGE_URL:
//       'https://prod-enatega-single-api.herokuapp.com/assets/images/logo.png',
//     STRIPE_STORE_NAME: 'Enatega',
//     TEST_OTP: '111111',
//     GOOGLE_PACES_API_BASE_URL: 'https://maps.googleapis.com/maps/api/place'
//   },
//   staging: {
//     GRAPHQL_URL: 'https://enatega-multivendor.up.railway.app/graphql',
//     WS_GRAPHQL_URL: 'wss://enatega-multivendor.up.railway.app/graphql',
//     SERVER_URL: 'https://enatega-multivendor.up.railway.app/', // put / at the end of server url
//     IOS_CLIENT_ID_GOOGLE:
//       '967541328677-30n1b9dljqadrr4badeku41980rf2dt1.apps.googleusercontent.com',
//     ANDROID_CLIENT_ID_GOOGLE:
//       '967541328677-7264tf7tkdtoufk844rck9mimrve135c.apps.googleusercontent.com',
//     AMPLITUDE_API_KEY: '42b182f3d18a21e8ab0ae881c6ef475f',
//     GOOGLE_MAPS_KEY: 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA',
//     EXPO_CLIENT_ID:
//       '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
//     SENTRY_DSN:
//       'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933',
//     TERMS_AND_CONDITIONS:
//       'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/terms',
//     PRIVACY_POLICY:
//       'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/privacy',
//     STRIPE_PUBLIC_KEY: 'pk_test_lEaBbVGnTkzja2FyFiNlbqtw',
//     STRIPE_IMAGE_URL:
//       'https://prod-enatega-single-api.herokuapp.com/assets/images/logo.png',
//     STRIPE_STORE_NAME: 'Enatega',
//     TEST_OTP: '111111',
//     GOOGLE_PACES_API_BASE_URL: 'https://maps.googleapis.com/maps/api/place'
//   },
//   production: {
//     GRAPHQL_URL: 'https://enatega-multivendor.up.railway.app/graphql',
//     WS_GRAPHQL_URL: 'wss://enatega-multivendor.up.railway.app/graphql',
//     SERVER_URL: 'https://enatega-multivendor.up.railway.app/', // put / at the end of server url
//     IOS_CLIENT_ID_GOOGLE:
//       '967541328677-30n1b9dljqadrr4badeku41980rf2dt1.apps.googleusercontent.com',
//     ANDROID_CLIENT_ID_GOOGLE:
//       '967541328677-7264tf7tkdtoufk844rck9mimrve135c.apps.googleusercontent.com',
//     AMPLITUDE_API_KEY: '42b182f3d18a21e8ab0ae881c6ef475f',
//     GOOGLE_MAPS_KEY: 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA',
//     EXPO_CLIENT_ID:
//       '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
//     SENTRY_DSN:
//       'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933',
//     TERMS_AND_CONDITIONS:
//       'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/terms',
//     PRIVACY_POLICY:
//       'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/privacy',
//     STRIPE_PUBLIC_KEY: 'pk_test_lEaBbVGnTkzja2FyFiNlbqtw',
//     STRIPE_IMAGE_URL:
//       'https://prod-enatega-single-api.herokuapp.com/assets/images/logo.png',
//     STRIPE_STORE_NAME: 'Enatega',
//     TEST_OTP: '111111',
//     GOOGLE_PACES_API_BASE_URL: 'https://maps.googleapis.com/maps/api/place'
//   }
// }

const getConfigData = () => {
  const { loading, data, error } = useQuery(GETCONFIGURATION)

  if (loading || error || !data.configuration) {
    return {
      graphqlUrlApp: '',
      wsGraphqlUrlApp: '',
      serverUrlApp: '',
      androidClientID: '',
      iOSClientID: '',
      appAmplitudeApiKey: '',
      googleApiKey: '',
      expoClientID: '',
      customerAppSentryUrl: '',
      termsAndConditions: '',
      privacyPolicy: '',
      testOtp: ''
    }
  }

  return data.configuration
}

const getEnvVars = async (env = Updates.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  // eslint-disable-next-line no-undef

  const configuration = getConfigData()
  if (env === 'production' || env === 'staging') {
    const {
      graphqlUrlApp,
      wsGraphqlUrlApp,
      serverUrlApp,
      androidClientID,
      iOSClientID,
      appAmplitudeApiKey,
      googleApiKey,
      expoClientID,
      customerAppSentryUrl,
      termsAndConditions,
      privacyPolicy,
      testOtp
    } = configuration
    return {
      GRAPHQL_URL: graphqlUrlApp,
      WS_GRAPHQL_URL: wsGraphqlUrlApp,
      SERVER_URL: serverUrlApp,
      IOS_CLIENT_ID_GOOGLE: iOSClientID,
      ANDROID_CLIENT_ID_GOOGLE: androidClientID,
      AMPLITUDE_API_KEY: appAmplitudeApiKey,
      GOOGLE_MAPS_KEY: googleApiKey,
      EXPO_CLIENT_ID: expoClientID,
      SENTRY_DSN: customerAppSentryUrl,
      TERMS_AND_CONDITIONS: termsAndConditions,
      PRIVACY_POLICY: privacyPolicy,
      TEST_OTP: testOtp
    }
  }
  return {
    GRAPHQL_URL: 'http://10.97.39.93:8001/graphql',
    WS_GRAPHQL_URL: 'ws://10.97.39.93:8001/graphql',
    SERVER_URL: 'ws://10.97.39.93:8001/',
    IOS_CLIENT_ID_GOOGLE:
      '967541328677-30n1b9dljqadrr4badeku41980rf2dt1.apps.googleusercontent.com',
    ANDROID_CLIENT_ID_GOOGLE:
      '967541328677-7264tf7tkdtoufk844rck9mimrve135c.apps.googleusercontent.com',
    AMPLITUDE_API_KEY: '42b182f3d18a21e8ab0ae881c6ef475f',
    GOOGLE_MAPS_KEY: 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA',
    EXPO_CLIENT_ID:
      '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
    SENTRY_DSN:
      'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933',
    TERMS_AND_CONDITIONS:
      'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/terms',
    PRIVACY_POLICY:
      'https://multivendor.enatega.com/?_gl=1*1yaissu*_ga*MTcwNTMzMjMyOC4xNjk1MTIwMjgz*_ga_DTSL4MVB5L*MTY5NTI3NDgxMC4yLjEuMTY5NTI3NDg0Ni4yNC4wLjA.&_ga=2.41568289.2005342604.1695274812-1705332328.1695120283#/privacy',
    STRIPE_PUBLIC_KEY: 'pk_test_lEaBbVGnTkzja2FyFiNlbqtw',
    STRIPE_IMAGE_URL:
      'https://prod-enatega-single-api.herokuapp.com/assets/images/logo.png',
    STRIPE_STORE_NAME: 'Enatega',
    TEST_OTP: '111111',
    GOOGLE_PACES_API_BASE_URL: 'https://maps.googleapis.com/maps/api/place'
  }
}

export default getEnvVars
