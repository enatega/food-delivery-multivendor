import React, { useContext, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import MainStack from './mainStack'
import AuthStack from './authStack'
import { AuthContext } from '../ui/context'
import * as Sentry from '@sentry/react-native'
import getEnvVars from '../../environment'

function AppContainer() {
  const { isLoggedIn } = useContext(AuthContext)

  const { SENTRY_DSN } = getEnvVars()

  useEffect(() => {
   
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        enableInExpoDevelopment: true,
        debug: true,
        tracesSampleRate: 1.0, // to be changed to 0.2 in production
        environment: 'development'
      })
    }
  }, [SENTRY_DSN])

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default Sentry.withProfiler(AppContainer)
