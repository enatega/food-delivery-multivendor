import React, { useState, useEffect, useReducer } from 'react'
import AppContainer from './src/routes'
import * as Notifications from 'expo-notifications'
import * as Font from 'expo-font'
import 'react-native-gesture-handler'
import * as SplashScreen from 'expo-splash-screen'
import * as Sentry from 'sentry-expo'
import { BackHandler, Platform, StatusBar, LogBox } from 'react-native'
import { ApolloProvider } from '@apollo/client'
import i18n from './i18n'
import { exitAlert } from './src/utils/androidBackButton'
import FlashMessage from 'react-native-flash-message'
import setupApolloClient from './src/apollo/index'
import ThemeReducer from './src/ui/ThemeReducer/ThemeReducer'
import ThemeContext from './src/ui/ThemeContext/ThemeContext'
import { ConfigurationProvider } from './src/context/Configuration'
import { UserProvider } from './src/context/User'
import { AuthProvider } from './src/context/Auth'
import { theme as Theme } from './src/utils/themeColors'
import { LocationContext } from './src/context/Location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'expo-dev-client'
import getEnvVars, { isProduction } from './environment'
import { requestTrackingPermissions } from './src/utils/useAppTrackingTrasparency'
import { OrdersProvider } from './src/context/Orders'
import { MessageComponent } from './src/components/FlashMessage/MessageComponent'

LogBox.ignoreLogs([
  'Warning: ...',
  'Sentry Logger ',
  'Constants.deviceYearClass'
]) // Ignore log notification by message
LogBox.ignoreAllLogs() // Ignore all log notifications

// Default Theme
const themeValue = 'Pink'
const { SENTRY_DSN } = getEnvVars()
const client = setupApolloClient()
Sentry.init({
  dsn: SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: !isProduction,
  tracesSampleRate: 1.0 // to be changed to 0.2 in production
})

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [location, setLocation] = useState(null)
  // Theme Reducer
  const [theme, themeSetter] = useReducer(ThemeReducer, themeValue)
  useEffect(() => {
    ;(async() => {
      try {
        await SplashScreen.preventAutoHideAsync()
      } catch (e) {
        console.warn(e)
      }
      loadAppData()
    })()

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', exitAlert)
    }
  }, [])

  useEffect(() => {
    try {
      AsyncStorage.getItem('theme').then(response =>
        response !== 'Pink' ? themeSetter({ type: response }) : null
      )
    } catch (error) {
      // Error retrieving data
      console.log('Theme Error : ', error.message)
    }
  }, [theme])

  useEffect(() => {
    if (!appIsReady) return
    ;(async() => {
      await SplashScreen.hideAsync()
    })()
  }, [appIsReady])

  useEffect(() => {
    if (!location) return
    ;(async() => {
      AsyncStorage.setItem('location', JSON.stringify(location))
    })()
  }, [location])

  useEffect(() => {
    requestTrackingPermissions()
  }, [])
  async function loadAppData() {
    await i18n.initAsync()
    await Font.loadAsync({
      MuseoSans300: require('./src/assets/font/MuseoSans/MuseoSans300.ttf'),
      MuseoSans500: require('./src/assets/font/MuseoSans/MuseoSans500.ttf'),
      MuseoSans700: require('./src/assets/font/MuseoSans/MuseoSans700.ttf')
    })
    await permissionForPushNotificationsAsync()
    await getActiveLocation()
    BackHandler.addEventListener('hardwareBackPress', exitAlert)

    setAppIsReady(true)
  }

  async function getActiveLocation() {
    try {
      const locationStr = await AsyncStorage.getItem('location')
      if (locationStr) {
        setLocation(JSON.parse(locationStr))
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function permissionForPushNotificationsAsync() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C'
      })
    }
  }

  if (appIsReady) {
    return (
      <ApolloProvider client={client}>
        <ThemeContext.Provider
          value={{ ThemeValue: theme, dispatch: themeSetter }}>
          <StatusBar
            backgroundColor={Theme[theme].menuBar}
            barStyle={theme === 'Dark' ? 'light-content' : 'dark-content'}
          />
          <LocationContext.Provider value={{ location, setLocation }}>
            <ConfigurationProvider>
              <AuthProvider>
                <UserProvider>
                  <OrdersProvider>
                    <AppContainer />
                  </OrdersProvider>
                </UserProvider>
              </AuthProvider>
            </ConfigurationProvider>
          </LocationContext.Provider>
          <FlashMessage MessageComponent={MessageComponent} />
        </ThemeContext.Provider>
      </ApolloProvider>
    )
  } else {
    return null
  }
}
