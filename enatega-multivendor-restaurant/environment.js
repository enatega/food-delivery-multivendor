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
        'https://4160f777e00c18da9dcff59780b76cdb@o4506268211412992.ingest.us.sentry.io/4506274472919040'
    }
  }
  return {
    GRAPHQL_URL: 'http://localhost:8001/graphql',
    WS_GRAPHQL_URL: 'ws://localhost:8001/graphql',

    // GRAPHQL_URL: 'https://new-enatega-api-staging.up.railway.app/graphql',
    // WS_GRAPHQL_URL: 'wss://new-enatega-api-staging.up.railway.app/graphql',
    SENTRY_DSN:
      configuration.restaurantAppSentryUrl ??
      'https://4160f777e00c18da9dcff59780b76cdb@o4506268211412992.ingest.us.sentry.io/4506274472919040'
  }
}

export default getEnvVars
