/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import * as Updates from 'expo-updates'

const ENV = {
  development: {
    GRAPHQL_URL: '', // [Enter  your server url:Enter your port number followed by any port number followed by graphql][example: http://192.168.100.117:8001/graphql]
    WS_GRAPHQL_URL: '', // [Append with ws:// if in development otherwise wss:// followed by your ip and port number followed by graphql][example: ws://192.168.100.97:8001/graphql]
    SENTRY_DSN: '' // [Add your own Sentry DSN link][example: https://e963731ba0f84e5d823a2bbe2968ea4d@o1103026.ingest.sentry.io/5135261]
  },
  staging: {
    GRAPHQL_URL: 'https://stagingenategamultivendorapi.herokuapp.com/graphql',
    WS_GRAPHQL_URL: 'wss://stagingenategamultivendorapi.herokuapp.com/graphql',
    SENTRY_DSN: '' // [Add your own Sentry DSN link][example: https://e963731ba0f84e5d823a2bbe2968ea4d@o1103026.ingest.sentry.io/5135261]
  },
  production: {
    GRAPHQL_URL: 'https://prodenategamultivendorapi.herokuapp.com/graphql',
    WS_GRAPHQL_URL: 'wss://prodenategamultivendorapi.herokuapp.com/graphql',
    SENTRY_DSN: '' // [Add your own Sentry DSN link][example: https://e963731ba0f84e5d823a2bbe2968ea4d@o1103026.ingest.sentry.io/5135261]
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
