import { ApolloProvider } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-get-random-values';
// import 'expo-dev-client'
import * as Device from 'expo-device'
import * as Font from 'expo-font'
import * as Notifications from 'expo-notifications'
import * as Updates from 'expo-updates'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { ActivityIndicator, BackHandler, I18nManager, LogBox, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View, useColorScheme } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import 'react-native-gesture-handler'
// import * as Sentry from '@sentry/react-native';
import useEnvVars, { isProduction } from './environment'
import setupApolloClient from './src/apollo/index'
import { MessageComponent } from './src/components/FlashMessage/MessageComponent'
import ReviewModal from './src/components/Review'
import { AuthProvider } from './src/context/Auth'
import { ConfigurationProvider } from './src/context/Configuration'
import { LocationProvider } from './src/context/Location'
import { OrdersProvider } from './src/context/Orders'
import { UserProvider } from './src/context/User'
import AppContainer from './src/routes'
import ThemeContext from './src/ui/ThemeContext/ThemeContext'
import ThemeReducer from './src/ui/ThemeReducer/ThemeReducer'
import { exitAlert } from './src/utils/androidBackButton'
import { NOTIFICATION_TYPES } from './src/utils/enums'
import { theme as Theme } from './src/utils/themeColors'
import { requestTrackingPermissions } from './src/utils/useAppTrackingTrasparency'
import { useKeepAwake } from 'expo-keep-awake'
import AnimatedSplashScreen from './src/components/Splash/AnimatedSplashScreen'
import useWatchLocation from './src/ui/hooks/useWatchLocation'
import './i18next'
import * as SplashScreen from 'expo-splash-screen'
import TextDefault from './src/components/Text/TextDefault/TextDefault'
import { ErrorBoundary } from './src/components/ErrorBoundary'
import * as Clarity from '@microsoft/react-native-clarity';


// LogBox.ignoreLogs([
//   // 'Warning: ...',
//   // 'Sentry Logger ',
//   'Constants.deviceYearClass'
// ]) // Ignore log notification by message
// LogBox.ignoreAllLogs() // Ignore all log notifications


Clarity.initialize('mcdyi6urgs', {
  logLevel: Clarity.LogLevel.Verbose, // Note: Use "LogLevel.Verbose" value while testing to debug initialization issues.
});

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: notification?.request?.content?.data?.type !== NOTIFICATION_TYPES.REVIEW_ORDER,
      shouldPlaySound: false,
      shouldSetBadge: false
    }
  }
})

export default function App() {
  const reviewModalRef = useRef()
  const [appIsReady, setAppIsReady] = useState(false)
  const [location, setLocation] = useState(null)
  // const responseListener = useRef()
  const [orderId, setOrderId] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  // const { SENTRY_DSN } = useEnvVars()
  const client = setupApolloClient()

  useKeepAwake()
  // useWatchLocation()

  // Use system theme
  const systemTheme = useColorScheme()
  const [theme, themeSetter] = useReducer(ThemeReducer, systemTheme === 'dark' ? 'Dark' : 'Pink')
  useEffect(() => {
    try {
      themeSetter({ type: systemTheme === 'dark' ? 'Dark' : 'Pink' })
    } catch (error) {
      // Error retrieving data
      console.log('Theme Error : ', error.message)
    }
  }, [systemTheme])

  // For Fonts, etc
  useEffect(() => {
    const loadAppData = async () => {
      // try {
      //   await SplashScreen.preventAutoHideAsync()
      // } catch (e) {
      //   console.warn(e)
      // }
      // await i18n.initAsync()
      await Font.loadAsync({
        MuseoSans300: require('./src/assets/font/MuseoSans/MuseoSans300.ttf'),
        MuseoSans500: require('./src/assets/font/MuseoSans/MuseoSans500.ttf'),
        MuseoSans700: require('./src/assets/font/MuseoSans/MuseoSans700.ttf')
      })
      // await permissionForPushNotificationsAsync()
      await getActiveLocation()
      // get stored theme
      // await getStoredTheme()
      setAppIsReady(true)
    }

    loadAppData()
    const backHandler = BackHandler.addEventListener('hardwareBackPress', exitAlert);


    return () => {
      backHandler.remove()
    }
  }, [])

  useEffect(() => {
    if (!appIsReady) return

    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync()
    }

    hideSplashScreen()
  }, [appIsReady])

  // For Location
  useEffect(() => {
    if (!location) return
    const saveLocation = async () => {
      await AsyncStorage.setItem('location', JSON.stringify(location))
    }
    saveLocation()
  }, [location])

  // For Permission
/*   useEffect(() => {
    requestTrackingPermissions()
  }, []) */

  // For Sentry
  // useEffect(() => {
  //   // if (SENTRY_DSN) {
  //   if (false) {
  //     Sentry.init({
  //       dsn: SENTRY_DSN,
  //       enableInExpoDevelopment: !isProduction ? true : false,
  //       environment: isProduction ? 'production' : 'development',
  //       debug: !isProduction,
  //       tracesSampleRate: 1.0,
  //       enableTracing: true
  //     })
  //   }
  // }, [SENTRY_DSN])

  // For App Update
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

  // For Push Notification
  useEffect(() => {
    // registerForPushNotificationsAsync()

    const notifSub  = Notifications.addNotificationReceivedListener((notification) => {
      if (notification?.request?.content?.data?.type === NOTIFICATION_TYPES.REVIEW_ORDER) {
        const id = notification?.request?.content?.data?._id
        if (id) {
          setOrderId(id)
          reviewModalRef?.current?.open()
        }
      }
    })

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      if (response?.notification?.request?.content?.data?.type === NOTIFICATION_TYPES.REVIEW_ORDER) {
        const id = response?.notification?.request?.content?.data?._id
        if (id) {
          setOrderId(id)
          reviewModalRef?.current?.open()
        }
      }
    })
    return () => {
      notifSub.remove()
      responseSub.remove()
    }
  }, [])

  // Handlers
  // get active location
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

  // get stored theme
  // const getStoredTheme = async () => {
  //   try {
  //     const storedTheme = await AsyncStorage.getItem('appTheme')
  //     if (storedTheme) {
  //       console.log('Retrieved theme from storage:', storedTheme)
  //       themeSetter({ type: storedTheme })
  //     } else {
  //       console.log('No theme found in storage, using default.')
  //       await AsyncStorage.setItem('appTheme', 'Dark') // Set default theme to Pink
  //     }
  //   } catch (error) {
  //     console.log('Error retrieving theme from storage:', error)
  //   }
  // }

  // set stored theme
  const setStoredTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('appTheme', newTheme)
    } catch (error) {
      console.log('Error storing theme in AsyncStorage:', error)
    }
  }

  // set modal close
  const onOverlayPress = () => {
    reviewModalRef?.current?.close()
  }

  if (isUpdating) {
    return (
      <View style={[styles.flex, styles.mainContainer, { backgroundColor: Theme[theme].startColor }]}>
        <TextDefault textColor={Theme[theme].white} bold>
          Please wait while app is updating
        </TextDefault>
        <ActivityIndicator size='large' color={Theme[theme].white} />
      </View>
    )
  }

  return (
    <ErrorBoundary>
    <AnimatedSplashScreen>
      <ApolloProvider client={client}>
        <ThemeContext.Provider
          // use default theme
          value={{ ThemeValue: theme, dispatch: themeSetter }}
          // use stored theme
          // value={{
          //   ThemeValue: theme,
          //   dispatch: (action) => {
          //     themeSetter(action)
          //     setStoredTheme(action.type) // Save the theme in AsyncStorage when it changes
          //   }
          // }}
        >
          <StatusBar backgroundColor={Theme[theme].menuBar} barStyle={theme === 'Dark' ? 'light-content' : 'dark-content'} />
          <LocationProvider>
            <ConfigurationProvider>
              <AuthProvider>
                <UserProvider>
                  <OrdersProvider>
                    <AppContainer />
                    <ReviewModal ref={reviewModalRef} onOverlayPress={onOverlayPress} theme={Theme[theme]} orderId={orderId} />
                  </OrdersProvider>
                </UserProvider>
              </AuthProvider>
            </ConfigurationProvider>
          </LocationProvider>
          <FlashMessage MessageComponent={MessageComponent} />
        </ThemeContext.Provider>
      </ApolloProvider>
    </AnimatedSplashScreen>
    </ErrorBoundary>
  )
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
    const { status } = await Notifications.requestPermissionsAsync()

    if (existingStatus !== 'granted') {
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
//       data: { type: NOTIFICATION_TYPES.REVIEW_ORDER, _id: '65e068b2150aab288f2b821f' }
//     },
//     trigger: { seconds: 10 }
//   })
// }

