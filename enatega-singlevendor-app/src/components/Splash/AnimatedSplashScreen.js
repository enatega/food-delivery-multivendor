import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import AnimatedSplash from './AnimatedSplash'

// Keep the native OS splash up until our theme-aware JS splash has painted, so
// there is no black/white flash at the native -> JS handoff.
SplashScreen.preventAutoHideAsync().catch(() => {})

export default function AnimatedSplashScreen({
  ready = false,
  themeReady = false,
  themeMode = 'Pink',
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
        <AnimatedSplash
          ready={ready}
          themeMode={themeMode}
          onFinish={() => setSplashDone(true)}
        />
      )}
    </View>
  )
}
