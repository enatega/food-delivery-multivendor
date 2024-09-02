/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

import * as Updates from 'expo-updates'
import { useContext } from 'react'
import Configuration from './src/ui/context/configuration'
import { BACKEND_URL } from './src/utilities'

const getEnvVars = (env = Updates.channel) => {
  const configuration = useContext(Configuration.Context)

  if (env === 'production' || env === 'staging') {
    return {
      ...BACKEND_URL.LIVE,
      SENTRY_DSN: configuration.restaurantAppSentryUrl
    }
  }
  return {
    ...BACKEND_URL.LIVE,
    SENTRY_DSN: configuration.restaurantAppSentryUrl
    // SENTRY_DSN:
    //   'https://91b55f514a2c4708845789d6e79abf10@o1103026.ingest.sentry.io/6131933'
  }
}

export default getEnvVars
