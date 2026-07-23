/**
 * EnategaJourneySplash
 *
 * "The Delivery Journey" animated splash: a customer, store and rider are
 * connected by a delivery route which transforms into Enatega's location-pin
 * symbol, finishing on the untouched official logo.
 *
 * Design/engineering notes:
 * - ONE transparent Lottie asset is used for both themes. The component
 *   paints the app's own theme background token underneath it, so the same
 *   animation works in light and dark mode and hands off seamlessly.
 * - The theme is resolved BEFORE anything is shown:
 *     1. user's saved preference (AsyncStorage 'theme', same key the app's
 *        ThemeReducer persists), 2. system color scheme, 3. app default.
 *   Until resolved, the native splash stays up (preventAutoHideAsync) so the
 *   wrong theme is never flashed.
 * - The ENATEGA wordmark is the official vector render, shipped in a black
 *   (light mode) and white (dark mode) variant and revealed by the component
 *   with a fade + rise — this keeps the animation asset itself theme-neutral.
 * - Reduce Motion: skips the route animation and cross-fades the completed
 *   logo instead.
 * - Failure safety: if Lottie fails to load/fire callbacks, a hard timeout
 *   completes the splash. The splash can never deadlock the app.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  AccessibilityInfo,
  AppState,
  Image,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LottieView from 'lottie-react-native'
import * as SplashScreen from 'expo-splash-screen'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated'
import { theme as Theme } from '../../utils/themeColors'

// Keep the native splash visible until we have resolved the theme and are
// ready to draw the identical first frame ourselves.
SplashScreen.preventAutoHideAsync().catch(() => {})

import { WORDMARK_LIGHT, WORDMARK_DARK } from '../../assets/splash/wordmarks'

const ANIMATION = require('../../assets/splash/enatega-journey-splash.json')
const WORDMARK = {
  light: WORDMARK_LIGHT,
  dark: WORDMARK_DARK
}

const DURATION_MS = 2700 // 162 frames @ 60fps
const WORDMARK_DELAY_MS = 2030 // frame 122
const WORDMARK_IN_MS = 400
const HARD_TIMEOUT_MS = 6000 // absolute deadlock guard
const REDUCED_MOTION_HOLD_MS = 1200

export default function EnategaJourneySplash({ children }) {
  const systemScheme = useColorScheme()
  const [resolvedTheme, setResolvedTheme] = useState(null) // 'Pink' | 'Dark'
  const [reduceMotion, setReduceMotion] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const [splashGone, setSplashGone] = useState(false)
  const [lottieFailed, setLottieFailed] = useState(false)
  const startedRef = useRef(false)
  const doneRef = useRef(false)
  const lottieRef = useRef(null)

  const overlayOpacity = useSharedValue(1)
  const overlayScale = useSharedValue(1)
  const wordmarkOpacity = useSharedValue(0)
  const wordmarkShift = useSharedValue(14)
  const { height: screenH } = useWindowDimensions()

  // ---- theme resolution: saved preference > system > default ----
  useEffect(() => {
    let mounted = true
    ;(async () => {
      let saved = null
      try {
        saved = await AsyncStorage.getItem('theme')
      } catch (e) {
        // storage unavailable — fall through to system/default
      }
      let motion = false
      try {
        motion = await AccessibilityInfo.isReduceMotionEnabled()
      } catch (e) {
        // treat as motion allowed
      }
      if (!mounted) return
      setReduceMotion(!!motion)
      if (saved === 'Dark' || saved === 'Pink') {
        setResolvedTheme(saved)
      } else {
        setResolvedTheme(systemScheme === 'dark' ? 'Dark' : 'Pink')
      }
    })()
    return () => {
      mounted = false
    }
    // Resolved once on mount by design: the splash must never switch theme
    // mid-animation, even if the system scheme changes underneath it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const completeSplash = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    // fade + slight scale-up into the app, mirroring the pin's geometry
    overlayOpacity.value = withTiming(
      0,
      { duration: 320, easing: Easing.out(Easing.cubic) },
      () => {
        runOnJS(setSplashGone)(true)
      }
    )
    overlayScale.value = withTiming(1.04, {
      duration: 320,
      easing: Easing.out(Easing.cubic)
    })
  }, [overlayOpacity, overlayScale])

  // ---- start once theme is known ----
  useEffect(() => {
    if (resolvedTheme === null || startedRef.current) return
    startedRef.current = true

    // Our first frame (theme background, empty canvas) now matches the
    // native splash background exactly — safe to hide it.
    SplashScreen.hideAsync().catch(() => {})

    if (reduceMotion) {
      // Reduced motion: no route animation; short fade of the finished logo.
      wordmarkOpacity.value = withTiming(1, { duration: 350 })
      wordmarkShift.value = 0
      const t = setTimeout(() => setAnimationDone(true), REDUCED_MOTION_HOLD_MS)
      return () => clearTimeout(t)
    }

    // wordmark reveal is timed against the Lottie timeline
    wordmarkOpacity.value = withDelay(
      WORDMARK_DELAY_MS,
      withTiming(1, { duration: WORDMARK_IN_MS, easing: Easing.out(Easing.cubic) })
    )
    wordmarkShift.value = withDelay(
      WORDMARK_DELAY_MS,
      withTiming(0, { duration: WORDMARK_IN_MS, easing: Easing.out(Easing.cubic) })
    )

    // completion fallback in case onAnimationFinish never fires
    const finishFallback = setTimeout(
      () => setAnimationDone(true),
      DURATION_MS + 600
    )
    return () => clearTimeout(finishFallback)
  }, [resolvedTheme, reduceMotion, wordmarkOpacity, wordmarkShift])

  // ---- absolute deadlock guard ----
  useEffect(() => {
    const t = setTimeout(() => setAnimationDone(true), HARD_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [])

  // ---- if Lottie failed, show static logo fallback briefly, then continue ----
  useEffect(() => {
    if (!lottieFailed) return
    wordmarkOpacity.value = withTiming(1, { duration: 300 })
    wordmarkShift.value = 0
    const t = setTimeout(() => setAnimationDone(true), 900)
    return () => clearTimeout(t)
  }, [lottieFailed, wordmarkOpacity, wordmarkShift])

  useEffect(() => {
    if (animationDone) completeSplash()
  }, [animationDone, completeSplash])

  // don't replay the entrance when returning from background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active' && doneRef.current) {
        // no-op: splash is already gone; nothing to replay
      }
    })
    return () => sub.remove()
  }, [])

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }]
  }))
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateY: wordmarkShift.value }]
  }))

  // Until the theme is resolved we render nothing: the native splash is
  // still covering the screen, so no wrong-theme frame can ever appear.
  if (resolvedTheme === null) {
    return <View style={styles.flex} />
  }

  const backgroundColor = Theme[resolvedTheme].themeBackground
  const isDark = resolvedTheme === 'Dark'
  // Lottie comp is 540x960; the wordmark sits at y 568..~600 of 960.
  const wordmarkTop = screenH * (568 / 960)

  return (
    <View style={styles.flex}>
      {children}
      {!splashGone && (
        <Animated.View
          pointerEvents='none'
          style={[StyleSheet.absoluteFill, overlayStyle, { backgroundColor }]}
        >
          {!lottieFailed ? (
            <LottieView
              ref={lottieRef}
              source={ANIMATION}
              style={StyleSheet.absoluteFill}
              resizeMode='cover'
              autoPlay={!reduceMotion}
              // Reduce Motion: hold the completed logo (final frame), no route
              progress={reduceMotion ? 1 : undefined}
              loop={false}
              speed={1}
              renderMode='HARDWARE'
              onAnimationFinish={() => setAnimationDone(true)}
              onAnimationFailure={() => setLottieFailed(true)}
            />
          ) : (
            // Hard failure fallback: the official static symbol
            <View style={styles.fallbackWrap}>
              <Image
                source={require('../../../assets/icon.png')}
                style={styles.fallbackLogo}
                resizeMode='contain'
              />
            </View>
          )}
          <Animated.Image
            source={isDark ? WORDMARK.dark : WORDMARK.light}
            style={[styles.wordmark, { top: wordmarkTop }, wordmarkStyle]}
            resizeMode='contain'
          />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  fallbackWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fallbackLogo: {
    width: 160,
    height: 160,
    borderRadius: 32
  },
  wordmark: {
    position: 'absolute',
    alignSelf: 'center',
    width: 236,
    height: 40
  }
})
