import { ApolloProvider } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'

import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import 'react-native-gesture-handler'

// import 'expo-dev-client'
import * as Device from 'expo-device'
import * as Font from 'expo-font'
import * as Notifications from 'expo-notifications'
import * as Updates from 'expo-updates'
import * as SplashScreen from 'expo-splash-screen'

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { ActivityIndicator, BackHandler, useColorScheme, View } from 'react-native'

import FlashMessage from 'react-native-flash-message'
import { useKeepAwake } from 'expo-keep-awake'

import useEnvVars, { isProduction } from './environment'
import setupApolloClient from './src/apollo/index'

import { MessageComponent } from './src/components/FlashMessage/MessageComponent'
import ReviewModal from './src/components/Review'
import AnimatedSplashScreen from './src/components/Splash/AnimatedSplashScreen'
import TextDefault from './src/components/Text/TextDefault/TextDefault'
import { ErrorBoundary } from './src/components/ErrorBoundary'

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

import './i18next'

Notifications.setNotificationHandler({
  handleNotification: async (notification) => ({
    shouldShowAlert:
      notification?.request?.content?.data?.type !== NOTIFICATION_TYPES.REVIEW_ORDER,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

export default function App() {
  const reviewModalRef = useRef()
  const [appIsReady, setAppIsReady] = useState(false)
  const [location, setLocation] = useState(null)
  const [orderId, setOrderId] = useState()
  const [isUpdating, setIsUpdating] = useState(false)

  const client = setupApolloClient()
  useKeepAwake()

  const systemTheme = useColorScheme()
  const [theme, themeSetter] = useReducer(
    ThemeReducer,
    systemTheme === 'dark' ? 'Dark' : 'Pink'
  )

  useEffect(() => {
    themeSetter({ type: systemTheme === 'dark' ? 'Dark' : 'Pink' })
  }, [systemTheme])

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
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      exitAlert
    )

    return () => backHandler.remove()
  }, [])

  useEffect(() => {
    if (appIsReady) SplashScreen.hideAsync()
  }, [appIsReady])

  useEffect(() => {
    if (location) {
      AsyncStorage.setItem('location', JSON.stringify(location))
    }
  }, [location])

  useEffect(() => {
    if (__DEV__) return

    ;(async () => {
      const { isAvailable } = await Updates.checkForUpdateAsync()
      if (isAvailable) {
        try {
          setIsUpdating(true)
          const { isNew } = await Updates.fetchUpdateAsync()
          if (isNew) await Updates.reloadAsync()
        } catch (e) {
          console.log(e)
        } finally {
          setIsUpdating(false)
        }
      }
    })()
  }, [])

  useEffect(() => {
    const notifSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (
          notification?.request?.content?.data?.type ===
          NOTIFICATION_TYPES.REVIEW_ORDER
        ) {
          const id = notification?.request?.content?.data?._id
          if (id) {
            setOrderId(id)
            reviewModalRef.current?.open()
          }
        }
      }
    )

    const responseSub =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (
          response?.notification?.request?.content?.data?.type ===
          NOTIFICATION_TYPES.REVIEW_ORDER
        ) {
          const id = response?.notification?.request?.content?.data?._id
          if (id) {
            setOrderId(id)
            reviewModalRef.current?.open()
          }
        }
      })

    return () => {
      notifSub.remove()
      responseSub.remove()
    }
  }, [])

  async function getActiveLocation() {
    try {
      const locationStr = await AsyncStorage.getItem('location')
      if (locationStr) setLocation(JSON.parse(locationStr))
    } catch (err) {
      console.log(err)
    }
  }

  if (isUpdating) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Theme[theme].startColor
        }}
      >
        <TextDefault textColor={Theme[theme].white} bold>
          Updating app...
        </TextDefault>
        <ActivityIndicator size="large" color={Theme[theme].white} />
      </View>
    )
  }

  return (
    <ErrorBoundary>
      <AnimatedSplashScreen>
        <ApolloProvider client={client}>
          <ThemeContext.Provider value={{ ThemeValue: theme, dispatch: themeSetter }}>
            <LocationProvider>
              <ConfigurationProvider>
                <AuthProvider>
                  <UserProvider>
                    <OrdersProvider>
                      <AppContainer />
                      <ReviewModal
                        ref={reviewModalRef}
                        theme={Theme[theme]}
                        orderId={orderId}
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
