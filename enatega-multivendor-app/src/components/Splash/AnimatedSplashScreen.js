import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import StaticSplash from './StaticSplash'

// Keep the native OS splash up until the static JS splash has painted.
SplashScreen.preventAutoHideAsync().catch(() => {})

export default function AnimatedSplashScreen({
  ready = false,
  themeReady = false,
  children
}) {
  const [splashDone, setSplashDone] = useState(false)

  // Keep the native layer visible until the saved app theme has been restored.
  // Effects run after the correctly themed animated splash has been committed,
  // avoiding a light splash flash for users who selected dark mode.
  useEffect(() => {
    if (!themeReady) return
    SplashScreen.hideAsync().catch(() => {})
  }, [themeReady])

  return (
    <View style={{ flex: 1 }}>
      {children}
      {!splashDone && themeReady && (
        <StaticSplash
          ready={ready}
          onFinish={() => setSplashDone(true)}
        />
      )}
    </View>
  )
}
