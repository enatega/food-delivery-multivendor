/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import * as Updates from 'expo-updates'
const ENV = {
  development: {
    GRAPHQL_URL: 'https://prodenategamultivendorapi.herokuapp.com/graphql',
    WS_GRAPHQL_URL: 'wss://prodenategamultivendorapi.herokuapp.com/graphql',
    SERVER_URL: 'https://prodenategamultivendorapi.herokuapp.com/', // put / at the end of server url
    IOS_CLIENT_ID_GOOGLE:
      '967541328677-nf8h4ou7rhmq9fahs87p057rggo95eah.apps.googleusercontent.com',
    ANDROID_CLIENT_ID_GOOGLE:
      '967541328677-7264tf7tkdtoufk844rck9mimrve135c.apps.googleusercontent.com',
    AMPLITUDE_API_KEY: '42b182f3d18a21e8ab0ae881c6ef475f',
    GOOGLE_MAPS_KEY: 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA',
    EXPO_CLIENT_ID:
      '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
    SENTRY_DSN:
      'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933',
    TERMS_AND_CONDITIONS: 'https://enatega.ninjascode.com/privacy-policy',
    PRIVACY_POLICY: 'https://enatega.ninjascode.com/privacy-policy',
    TEST_OTP: '111111'
  },
  staging: {
    GRAPHQL_URL: 'https://stagingenategamultivendorapi.herokuapp.com/graphql',
    WS_GRAPHQL_URL: 'wss://stagingenategamultivendorapi.herokuapp.com/graphql',
    SERVER_URL: 'https://stagingenategamultivendorapi.herokuapp.com/', // put / at the end of server url
    IOS_CLIENT_ID_GOOGLE: '', // [Add your Google client id see documentation for more information on how to generate it][example: 967541328677 - ge2hpr1n095d0nro56kot0t4q388dsll.apps.googleusercontent.com]
    ANDROID_CLIENT_ID_GOOGLE: '', // [Add your Android google client id see documentation][example: 977541328677-u9lbhmiesp67j3md9b8nk6mkhooeljur.apps.googleusercontent.com]
    AMPLITUDE_API_KEY: '', // [Add your Amplitude api key see documentation for more information][example: 3114f5db4c014dc7ad4ed2ad747341b5]
    GOOGLE_MAPS_KEY: '', // [Add your Google map key see documentation for more information][example: BIzaSyCzNP5qQql2a5y8lOoO - 1yj1lj_tzjVImA],
    EXPO_CLIENT_ID: '', // [Add your Expo Client Id see documentation for more information][example: 977541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com]
    SENTRY_DSN: '', // [Add your own Sentry DSN link][example: https://e963731ba0f84e5d823a2bbe2968ea4d@o1103026.ingest.sentry.io/5135261]
    TERMS_AND_CONDITIONS: 'https://enatega.ninjascode.com/privacy-policy',
    PRIVACY_POLICY: 'https://enatega.ninjascode.com/privacy-policy',
    TEST_OTP: '111111'
  },
  production: {
    GRAPHQL_URL: 'https://prodenategamultivendorapi.herokuapp.com/graphql',
    WS_GRAPHQL_URL: 'wss://prodenategamultivendorapi.herokuapp.com/graphql',
    SERVER_URL: 'https://prodenategamultivendorapi.herokuapp.com/', // put / at the end of server url
    IOS_CLIENT_ID_GOOGLE:
      '967541328677-nf8h4ou7rhmq9fahs87p057rggo95eah.apps.googleusercontent.com',
    ANDROID_CLIENT_ID_GOOGLE:
      '967541328677-7264tf7tkdtoufk844rck9mimrve135c.apps.googleusercontent.com',
    AMPLITUDE_API_KEY: '42b182f3d18a21e8ab0ae881c6ef475f',
    GOOGLE_MAPS_KEY: 'AIzaSyCzNP5qQql2a5y8lOoO-1yj1lj_tzjVImA',
    EXPO_CLIENT_ID:
      '967541328677-d46sl62t52g5r3o5m0mnl2hpptr242nl.apps.googleusercontent.com',
    SENTRY_DSN:
      'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933',
    TERMS_AND_CONDITIONS: 'https://enatega.ninjascode.com/privacy-policy',
    PRIVACY_POLICY: 'https://enatega.ninjascode.com/privacy-policy',
    TEST_OTP: '111111'
  }
}

const getEnvVars = (env = Updates.releaseChannel) => {
  // What is __DEV__ ?
  // This variable is set to true when react-native is running in Dev mode.
  // __DEV__ is true when run locally, but false when published.
  // eslint-disable-next-line no-undef
  if (env === 'production') {
    return ENV.production
  } else if (env === 'staging') {
    return ENV.staging
  } else {
    return ENV.development
  }
}

export default getEnvVars
