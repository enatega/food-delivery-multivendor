import * as Updates from 'expo-updates'
import { useContext } from 'react'
import ConfigurationContext from './src/context/configuration'

const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(ConfigurationContext)

  if (env === 'production' || env === 'staging') {
    return {
      GRAPHQL_URL: 'https://new-enatega-api-staging.up.railway.app/graphql',
      WS_GRAPHQL_URL: 'wss://new-enatega-api-staging.up.railway.app/graphql',
      SENTRY_DSN:
        configuration.riderAppSentryUrl ??
        'https://e963731ba0f84e5d823a2bbe2968ea4d@o1103026.ingest.sentry.io/6135261',
      GOOGLE_MAPS_KEY: configuration.googleApiKey
    }
  }
  return {
    // GRAPHQL_URL: 'http://10.97.0.172:8001/graphql',
    // WS_GRAPHQL_URL: 'ws://10.97.0.172:8001/graphql',
    GRAPHQL_URL: 'https://new-enatega-api-staging.up.railway.app/graphql',
    WS_GRAPHQL_URL: 'wss://new-enatega-api-staging.up.railway.app/graphql',
    SENTRY_DSN:
      configuration.riderAppSentryUrl ??
      'https://e963731ba0f84e5d823a2bbe2968ea4d@o1103026.ingest.sentry.io/6135261',
    GOOGLE_MAPS_KEY: configuration.googleApiKey
  }
}

export default getEnvVars
