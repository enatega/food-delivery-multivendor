import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ApolloProvider } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import FlashMessage from 'react-native-flash-message'
import { useFonts } from '@use-expo/font'
import * as Updates from 'expo-updates'
import { AuthContext, Configuration } from './src/ui/context'
import AppContainer from './src/navigation'
import setupApolloClient from './src/apollo/client'
import { Spinner, TextDefault } from './src/components'
import { colors } from './src/utilities'
import { ActivityIndicator, StyleSheet, View, LogBox } from 'react-native'
import * as Sentry from 'sentry-expo'
import getEnvVars, {isProduction} from './environment'
import 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store'
import { useKeepAwake } from 'expo-keep-awake';
import AnimatedSplashScreen from './src/components/Splash/AnimatedSplashScreen'

LogBox.ignoreLogs([
  'Warning: ...',
  'Sentry Logger ',
  'Constants.deviceYearClass'
]) // Ignore log notification by message
LogBox.ignoreAllLogs() // Ignore all log notifications

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false)
  const [token, setToken] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [appError, setAppError] = useState(null); // Track initialization errors

  const { SENTRY_DSN } = getEnvVars()
  const client = setupApolloClient()

  useKeepAwake()

  useEffect(() => {
    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        enableInExpoDevelopment: !isProduction ? true : false,
        environment: !isProduction ? 'development' : 'production',
        debug: !isProduction,
        tracesSampleRate: 1.0 // to be changed to 0.2 in production
      })
    }
  }, [SENTRY_DSN])

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          setToken(token);
        }
        setIsAppReady(true);
      } catch (error) {
        console.error("Error retrieving token:", error);
        setIsAppReady(false);
        setAppError("Failed to initialize application. Please try again.");
      }
    })();
  }, []);

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

  const login = async (token, restaurantId) => {
    try {
      await SecureStore.setItemAsync('token', token);
      await AsyncStorage.setItem('restaurantId', restaurantId);
      setToken(token);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await AsyncStorage.removeItem('restaurantId');
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [fontLoaded, fontError] = useFonts({
    MuseoSans300: require('./assets/font/MuseoSans/MuseoSans300.ttf'),
    MuseoSans500: require('./assets/font/MuseoSans/MuseoSans500.ttf'),
    MuseoSans700: require('./assets/font/MuseoSans/MuseoSans700.ttf'),
  });

    // Monitor font loading errors
    useEffect(() => {
      if (fontError) {
        console.error("Error loading fonts:", fontError);
        setAppError("Failed to load fonts. Please restart the app.");
      }
    }, [fontError]);

  if (isUpdating) {
    return (
      <View
        style={[
          styles.flex,
          styles.mainContainer,
          { backgroundColor: colors.startColor }
        ]}>
        <TextDefault textColor={colors.white} bold>
          Please wait while app is updating
        </TextDefault>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    )
  }


  if (appError) {
    // Display an error screen if initialization fails
    return (
      <View style={[styles.flex, styles.mainContainer]}>
        <TextDefault textColor={colors.red} bold>
          {appError}
        </TextDefault>
        <TextDefault textColor={colors.grey} style={{ marginTop: 10 }}>
          Please restart the app or contact support.
        </TextDefault>
      </View>
    );
  }
  
  if (fontLoaded && isAppReady) {
    return (
      <AnimatedSplashScreen>
      <ApolloProvider client={client}>
        <StatusBar style="dark" backgroundColor={colors.headerBackground} />
        <Configuration.Provider>
          <AuthContext.Provider value={{ isLoggedIn: !!token, login, logout }}>
            <SafeAreaProvider>
              <AppContainer />
            </SafeAreaProvider>
          </AuthContext.Provider>
        </Configuration.Provider>
        <FlashMessage />
      </ApolloProvider>
      </AnimatedSplashScreen>
    )
  } else {
    return <Spinner />
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
