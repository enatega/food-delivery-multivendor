import { ApolloProvider } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-get-random-values';
// import 'expo-dev-client'
import * as Font from 'expo-font'
import * as Notifications from 'expo-notifications'
import * as Updates from 'expo-updates'
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ActivityIndicator, AppState, BackHandler, StatusBar, StyleSheet, View, useColorScheme } from 'react-native'
import FlashMessage from 'react-native-flash-message'
import 'react-native-gesture-handler'
import useEnvVars from './environment'
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
import { useKeepAwake } from 'expo-keep-awake'
import AnimatedSplashScreen from './src/components/Splash/AnimatedSplashScreen'
import './i18next'
import * as SplashScreen from 'expo-splash-screen'
import TextDefault from './src/components/Text/TextDefault/TextDefault'
import { ErrorBoundary } from './src/components/ErrorBoundary'
import SessionExpiredModal from './src/components/SessionExpiredModal/SessionExpiredModal'
import navigationService from './src/routes/navigationService'
import {
  shouldShowSessionExpiredModal,
  subscribeToSessionInvalidation,
  subscribeToSessionExpiredModalDismiss
} from './src/utils/session'
import {
  initializePublicAccessToken,
  stopPublicAccessTokenRefresh
} from './src/services/publicAcccessService'

const CLARITY_CONSENT_KEY = 'clarity_tracking_consent'

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
  const [orderId, setOrderId] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const [sessionExpiredVisible, setSessionExpiredVisible] = useState(false)
  const [clarityInitialized, setClarityInitialized] = useState(false)
  const { CLARITY_ENABLED, GRAPHQL_URL, WS_GRAPHQL_URL } = useEnvVars()
  const client = useMemo(
    () => setupApolloClient({ GRAPHQL_URL, WS_GRAPHQL_URL }),
    [GRAPHQL_URL, WS_GRAPHQL_URL]
  )

  // Fetch/refresh the public (MetricsGeneral) token up front and keep it fresh
  // via a background timer, instead of refreshing only when a request finds it
  // expired. Also refresh when the app returns to the foreground, since RN
  // suspends timers while backgrounded.
  useEffect(() => {
    if (!GRAPHQL_URL) return undefined

    initializePublicAccessToken(GRAPHQL_URL)

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        initializePublicAccessToken(GRAPHQL_URL)
      }
    })

    return () => {
      subscription.remove()
      stopPublicAccessTokenRefresh()
    }
  }, [GRAPHQL_URL])

  useKeepAwake()

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
      await Font.loadAsync({
        MuseoSans300: require('./src/assets/font/MuseoSans/MuseoSans300.ttf'),
        MuseoSans500: require('./src/assets/font/MuseoSans/MuseoSans500.ttf'),
        MuseoSans700: require('./src/assets/font/MuseoSans/MuseoSans700.ttf')
      })
      await getActiveLocation()
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

  useEffect(() => {
    const unsubscribe = subscribeToSessionInvalidation(({ reason }) => {
      if (shouldShowSessionExpiredModal(reason)) {
        setSessionExpiredVisible(true)
      }
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToSessionExpiredModalDismiss(() => {
      setSessionExpiredVisible(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (__DEV__ || !CLARITY_ENABLED || clarityInitialized) return

    let isMounted = true

    ;(async () => {
      try {
        const consent = await AsyncStorage.getItem(CLARITY_CONSENT_KEY)
        if (consent !== 'granted' || !isMounted) return

        const Clarity = await import('@microsoft/react-native-clarity')
        if (!isMounted) return

        Clarity.initialize('mcdyi6urgs', {
          logLevel: Clarity.LogLevel.None
        })
        setClarityInitialized(true)
      } catch (error) {
        console.warn('Clarity initialization skipped:', error?.message ?? error)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [CLARITY_ENABLED, clarityInitialized])

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

  // set modal close
  const onOverlayPress = () => {
    reviewModalRef?.current?.close()
  }

  const handleSessionExpiredLogin = () => {
    setSessionExpiredVisible(false)
    navigationService.navigate('CreateAccount')
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
          value={{ ThemeValue: theme, dispatch: themeSetter }}
        >
          <StatusBar backgroundColor={Theme[theme].menuBar} barStyle={theme === 'Dark' ? 'light-content' : 'dark-content'} />
          <LocationProvider>
            <ConfigurationProvider>
              <AuthProvider>
                <UserProvider>
                  <OrdersProvider>
                    <AppContainer />
                    <ReviewModal ref={reviewModalRef} onOverlayPress={onOverlayPress} theme={Theme[theme]} orderId={orderId} />
                    <SessionExpiredModal
                      visible={sessionExpiredVisible}
                      onLogin={handleSessionExpiredLogin}
                    />
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
