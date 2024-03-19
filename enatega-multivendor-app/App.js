import React, { useState, useEffect, useReducer } from 'react'
import AppContainer from './src/routes'
import * as Notifications from 'expo-notifications'
import * as Font from 'expo-font'
import 'react-native-gesture-handler'
import * as SplashScreen from 'expo-splash-screen'
// import * as Sentry from 'sentry-expo'
import {
  BackHandler,
  Platform,
  StatusBar,
  LogBox,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { ApolloProvider } from '@apollo/client'
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
import useEnvVars, { isProduction } from './environment'
import { requestTrackingPermissions } from './src/utils/useAppTrackingTrasparency'
import { OrdersProvider } from './src/context/Orders'
import { MessageComponent } from './src/components/FlashMessage/MessageComponent'
import * as Updates from 'expo-updates'

LogBox.ignoreLogs([
  'Warning: ...',
  'Sentry Logger ',
  'Constants.deviceYearClass'
]) // Ignore log notification by message
LogBox.ignoreAllLogs() // Ignore all log notifications

// Default Theme
const themeValue = 'Pink'

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [location, setLocation] = useState(null)
  // Theme Reducer
  const [theme, themeSetter] = useReducer(ThemeReducer, themeValue)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadAppData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync()
      } catch (e) {
        console.warn(e)
      }
      // await i18n.initAsync()
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

    loadAppData()

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', exitAlert)
    }
  }, [])

  useEffect(() => {
    try {
      AsyncStorage.getItem('theme').then((response) =>
        response !== 'Pink' ? themeSetter({ type: response }) : null
      )
    } catch (error) {
      // Error retrieving data
      console.log('Theme Error : ', error.message)
    }
  }, [theme])

  useEffect(() => {
    if (!appIsReady) return

    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync()
    }

    hideSplashScreen()
  }, [appIsReady])

  useEffect(() => {
    if (!location) return

    const saveLocation = async () => {
      await AsyncStorage.setItem('location', JSON.stringify(location))
    }

    saveLocation()
  }, [location])

  useEffect(() => {
    requestTrackingPermissions()
  }, [])

  const { SENTRY_DSN } = useEnvVars()
  const client = setupApolloClient()

  // useEffect(() => {
  //   if (SENTRY_DSN) {
  //     Sentry.init({
  //       dsn: SENTRY_DSN,
  //       enableInExpoDevelopment: true,
  //       debug: !isProduction,
  //       tracesSampleRate: 1.0 // to be changed to 0.2 in production
  //     })
  //   }
  // }, [SENTRY_DSN])

  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (__DEV__) return
    ;(async () => {
      const { isAvailable } = await Updates.checkForUpdateAsync()
      if (isAvailable) {
        try {
          setIsUpdating(true)
          const { isNew } = await Updates.fetchUpdateAsync()
          if (isNew) {
            await Updates.reloadAsync()
          }
        } catch (error) {
          console.log('error while updating app', JSON.stringify(error))
        } finally {
          setIsUpdating(false)
        }
      }
    })()
  }, [])

  if (isUpdating) {
    return (
      <View
        style={[
          styles.flex,
          styles.mainContainer,
          { backgroundColor: Theme[theme].startColor }
        ]}
      >
        <TextDefault textColor={Theme[theme].white} bold>
          Please wait while app is updating
        </TextDefault>
        <ActivityIndicator size='large' color={Theme[theme].white} />
      </View>
    )
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
          value={{ ThemeValue: theme, dispatch: themeSetter }}
        >
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

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
