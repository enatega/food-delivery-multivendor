import * as Updates from 'expo-updates'
import { useContext } from 'react'
import ConfigurationContext from './src/context/configuration'
import { BACKEND_URL } from './src/utilities/constants'

const getEnvVars = (env = Updates.releaseChannel) => {
  const configuration = useContext(ConfigurationContext)

  if (env === 'production' || env === 'staging') {
    return {
      ...BACKEND_URL.LIVE,
      SENTRY_DSN: configuration.riderAppSentryUrl,
      GOOGLE_MAPS_KEY: configuration.googleApiKey
    }
  }
  return {
    ...BACKEND_URL.LIVE,
    SENTRY_DSN: configuration.riderAppSentryUrl,
    GOOGLE_MAPS_KEY: configuration.googleApiKey
  }
}

export default getEnvVars
