import React, { useState, useEffect, useReducer, useRef } from 'react'
import AppContainer from './src/routes'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import * as Font from 'expo-font'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as SplashScreen from 'expo-splash-screen'
import * as Sentry from 'sentry-expo'
import { BackHandler, Platform, StatusBar, LogBox } from 'react-native'
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
import { LocationProvider } from './src/context/Location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'expo-dev-client'
import useEnvVars, { isProduction } from './environment'
import { requestTrackingPermissions } from './src/utils/useAppTrackingTrasparency'
import { OrdersProvider } from './src/context/Orders'
import { MessageComponent } from './src/components/FlashMessage/MessageComponent'
import ReviewModal from './src/components/Review'
import { NOTIFICATION_TYPES } from './src/utils/enums'

LogBox.ignoreLogs([
  'Warning: ...',
  'Sentry Logger ',
  'Constants.deviceYearClass'
]) // Ignore log notification by message
LogBox.ignoreAllLogs() // Ignore all log notifications

// Default Theme
const themeValue = 'Pink'

Notifications.setNotificationHandler({
  handleNotification: async notification => {
    return {
      shouldShowAlert: notification?.request?.trigger?.remoteMessage?.data?.type !== NOTIFICATION_TYPES.REVIEW_ORDER,
      shouldPlaySound: false,
      shouldSetBadge: false
    }
  }
})

export default function App() {
  const reviewModalRef = useRef()
  const [appIsReady, setAppIsReady] = useState(false)
  const [location, setLocation] = useState(null)
  const notificationListener = useRef()
  const responseListener = useRef()
  const [orderId, setOrderId] = useState()
  // Theme Reducer
  const [theme, themeSetter] = useReducer(ThemeReducer, themeValue)

  useEffect(() => {
    const loadAppData = async() => {
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
      // await permissionForPushNotificationsAsync()
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

    const hideSplashScreen = async() => {
      await SplashScreen.hideAsync()
    }

    hideSplashScreen()
  }, [appIsReady])

  useEffect(() => {
    if (!location) return

    const saveLocation = async() => {
      await AsyncStorage.setItem('location', JSON.stringify(location))
    }

    saveLocation()
  }, [location])

  useEffect(() => {
    requestTrackingPermissions()
  }, [])

  const { SENTRY_DSN } = useEnvVars()
  const client = setupApolloClient()

  useEffect(() => {
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        enableInExpoDevelopment: true,
        debug: !isProduction,
        tracesSampleRate: 1.0 // to be changed to 0.2 in production
      })
    }
  }, [SENTRY_DSN])

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

  useEffect(() => {
    registerForPushNotificationsAsync()

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      if (notification?.request?.trigger?.remoteMessage?.data?.type === NOTIFICATION_TYPES.REVIEW_ORDER) {
        const id = notification?.request?.trigger?.remoteMessage?.data?._id
        if (id) {
          setOrderId(id)
          reviewModalRef.current.open()
        }
      }
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (response?.notification?.request?.trigger?.remoteMessage?.data?.type === NOTIFICATION_TYPES.REVIEW_ORDER) {
        const id = response?.notification?.request?.trigger?.remoteMessage?.data?._id
        if (id) {
          setOrderId(id)
          reviewModalRef.current.open()
        }
      }
    })
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const onOverlayPress = () => {
    reviewModalRef.current.close()
  }

  if (appIsReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ApolloProvider client={client}>
          <ThemeContext.Provider
            value={{ ThemeValue: theme, dispatch: themeSetter }}>
            <StatusBar
              backgroundColor={Theme[theme].menuBar}
              barStyle={theme === 'Dark' ? 'light-content' : 'dark-content'}
            />
            <LocationProvider>
              <ConfigurationProvider>
                <AuthProvider>
                  <UserProvider>
                    <OrdersProvider>
                      <AppContainer />
                      <ReviewModal ref={reviewModalRef} onOverlayPress={onOverlayPress} theme={Theme[theme]} orderId={orderId}/>
                    </OrdersProvider>
                  </UserProvider>
                </AuthProvider>
              </ConfigurationProvider>
            </LocationProvider>
            <FlashMessage MessageComponent={MessageComponent} />
          </ThemeContext.Provider>
        </ApolloProvider>
      </GestureHandlerRootView>
    )
  } else {
    return null
  }
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
    }
  } else {
    alert('Must use physical device for Push Notifications')
  }
}

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { type: NOTIFICATION_TYPES.REVIEW_ORDER, orderId: '65e068b2150aab288f2b821f' }
//     },
//     trigger: { seconds: 10 }
//   })
// }
