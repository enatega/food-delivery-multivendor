/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import * as Updates from 'expo-updates'
import { useContext } from 'react'
import Configuration from './src/ui/context/configuration'

const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(Configuration.Context)

  if (env === 'production' || env === 'staging') {
    return {
      GRAPHQL_URL: 'https://new-enatega-api-staging.up.railway.app/graphql',
      WS_GRAPHQL_URL: 'wss://new-enatega-api-staging.up.railway.app/graphql',
      SENTRY_DSN:
        configuration.restaurantAppSentryUrl ??
        'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933'
    }
  }
  return {
    // GRAPHQL_URL: 'http://10.97.0.172:8001/graphql',
    // WS_GRAPHQL_URL: 'ws://10.97.0.172:8001/graphql',

    GRAPHQL_URL: 'https://new-enatega-api-staging.up.railway.app/graphql',
    WS_GRAPHQL_URL: 'wss://new-enatega-api-staging.up.railway.app/graphql',
    SENTRY_DSN:
      configuration.restaurantAppSentryUrl ??
      'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933'
  }
}

export default getEnvVars
