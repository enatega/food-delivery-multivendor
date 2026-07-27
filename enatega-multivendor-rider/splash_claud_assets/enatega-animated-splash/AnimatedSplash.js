/**
 * AnimatedSplash — Enatega animated splash screen (dark + light, all screen sizes)
 *
 * A 1:1 port of the approved splash video, rendered natively with Reanimated.
 * - Theme follows the system automatically (useColorScheme)
 * - Scales to any device size / aspect ratio (design frame: 540 x 1170)
 * - Plays intro, then holds a gentle idle loop until `ready` is true,
 *   then plays the green outro and calls `onFinish`
 *
 * Deps: react-native-reanimated (v2/v3), expo-linear-gradient — both already
 * part of the Enatega apps.
 *
 * Usage (App.js):
 *   const [appReady, setAppReady] = useState(false)
 *   const [splashDone, setSplashDone] = useState(false)
 *   ...
 *   {!splashDone && (
 *     <AnimatedSplash ready={appReady} onFinish={() => setSplashDone(true)} />
 *   )}
 */

import React, { useEffect, useRef } from 'react'
import { StyleSheet, useWindowDimensions, useColorScheme } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
  interpolate,
  runOnJS
} from 'react-native-reanimated'

const PIN = require('./assets/pin.png')
const WM_WHITE = require('./assets/wordmarkWhite.png')
const WM_NAVY = require('./assets/wordmarkNavy.png')
const GLOW = require('./assets/glow.png')

const THEMES = {
  dark: {
    bg: ['#111c33', '#0b1225', '#070d1e'],
    wordmark: WM_WHITE,
    ring: 'rgba(110,224,122,0.85)',
    underline: '#6ee07a',
    orbOpacity: 1
  },
  light: {
    bg: ['#ffffff', '#f4f8f5', '#e7efe9'],
    wordmark: WM_NAVY,
    ring: 'rgba(47,164,87,0.75)',
    underline: '#3fb85a',
    orbOpacity: 0.8
  }
}

const GREEN = '#5ecf72'
const OUT_CUBIC = Easing.out(Easing.cubic)
const IN_CUBIC = Easing.in(Easing.cubic)
const INOUT_CUBIC = Easing.inOut(Easing.cubic)
const BACK_OUT = Easing.out(Easing.back(1.6))
const SINE_INOUT = Easing.inOut(Easing.sin)

export default function AnimatedSplash({ ready = true, minDuration = 2400, onFinish }) {
  const { width, height } = useWindowDimensions()
  const scheme = useColorScheme()
  const theme = THEMES[scheme === 'dark' ? 'dark' : 'light']

  // Design frame is 540 x 1170; scale proportionally to the device
  const sf = Math.min(width / 540, height / 1170)
  const CY = height * 0.44 // vertical anchor of the logo group

  // circle-wipe scale needed to cover the whole screen from the anchor point
  const wipeBase = 60 * sf
  const coverScale =
    (2.3 * Math.sqrt(Math.pow(width / 2, 2) + Math.pow(Math.max(CY, height - CY), 2))) / wipeBase

  // ---- shared values ----
  const ring1 = useSharedValue(0)
  const ring2 = useSharedValue(0)
  const pinIn = useSharedValue(0) // entrance progress (scale/translate)
  const pinOp = useSharedValue(0)
  const glowOp = useSharedValue(0)
  const glowScale = useSharedValue(0.55)
  const bob = useSharedValue(0) // idle float
  const wmReveal = useSharedValue(0)
  const wmOp = useSharedValue(0)
  const underline = useSharedValue(0)
  const wipe = useSharedValue(0)
  const whitePin = useSharedValue(0) // crossfade to white mark during outro
  const outroStarted = useRef(false)
  const mountedAt = useRef(Date.now())

  // ---- intro + idle ----
  useEffect(() => {
    ring1.value = withDelay(100, withTiming(1, { duration: 650, easing: OUT_CUBIC }))
    ring2.value = withDelay(350, withTiming(1, { duration: 700, easing: OUT_CUBIC }))
    pinOp.value = withDelay(150, withTiming(1, { duration: 400, easing: OUT_CUBIC }))
    pinIn.value = withDelay(150, withTiming(1, { duration: 650, easing: BACK_OUT }))
    glowOp.value = withDelay(300, withTiming(0.9, { duration: 650, easing: OUT_CUBIC }))
    glowScale.value = withDelay(300, withTiming(1, { duration: 650, easing: OUT_CUBIC }))
    wmOp.value = withDelay(850, withTiming(1, { duration: 120 }))
    wmReveal.value = withDelay(850, withTiming(1, { duration: 650, easing: INOUT_CUBIC }))
    underline.value = withDelay(1300, withTiming(1, { duration: 550, easing: OUT_CUBIC }))
    // idle float: gentle bob, ±5dp, ~2.4s period
    bob.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: SINE_INOUT }),
          withTiming(-1, { duration: 1200, easing: SINE_INOUT })
        ),
        -1,
        true
      )
    )
  }, [])

  // ---- outro: wait for `ready` AND the minimum display time ----
  useEffect(() => {
    if (!ready || outroStarted.current) return
    const elapsed = Date.now() - mountedAt.current
    const wait = Math.max(0, minDuration - elapsed)
    const id = setTimeout(() => {
      if (outroStarted.current) return
      outroStarted.current = true
      cancelAnimation(bob)
      // wordmark + underline out
      wmOp.value = withTiming(0, { duration: 220, easing: IN_CUBIC })
      underline.value = withTiming(0, { duration: 200 })
      // glow flares as the green floods out from behind the pin
      glowOp.value = withTiming(1, { duration: 320, easing: IN_CUBIC })
      glowScale.value = withTiming(2.6, { duration: 380, easing: IN_CUBIC })
      wipe.value = withTiming(1, { duration: 430, easing: IN_CUBIC })
      // pin crossfades into the white mark while the circle engulfs it
      whitePin.value = withDelay(140, withTiming(1, { duration: 260, easing: INOUT_CUBIC }))
      if (onFinish) {
        // small hold on the green end-frame, then hand off to the app
        setTimeout(() => onFinish(), 680)
      }
    }, wait)
    return () => clearTimeout(id)
  }, [ready, minDuration, onFinish])

  // ---- animated styles ----
  const ring1Style = useAnimatedStyle(() => ({
    opacity: 0.6 * (1 - ring1.value),
    transform: [{ scale: 0.3 + 2.9 * ring1.value }]
  }))
  const ring2Style = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - ring2.value),
    transform: [{ scale: 0.3 + 2.4 * ring2.value }]
  }))
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOp.value,
    transform: [{ scale: glowScale.value * (1 + 0.05 * bob.value) }]
  }))
  const pinGroupStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: 34 * sf * (1 - pinIn.value) + 5 * sf * bob.value },
      { scale: (0.55 + 0.45 * pinIn.value) * (1 + 0.08 * wipe.value) }
    ]
  }))
  const pinColorStyle = useAnimatedStyle(() => ({
    opacity: pinOp.value * (1 - whitePin.value)
  }))
  const pinWhiteStyle = useAnimatedStyle(() => ({ opacity: whitePin.value }))
  const wmWrapStyle = useAnimatedStyle(() => ({ opacity: wmOp.value }))
  const wmClipStyle = useAnimatedStyle(() => ({
    width: 252 * sf * wmReveal.value
  }))
  const underlineStyle = useAnimatedStyle(() => ({
    opacity: 0.9 * underline.value * wmOp.value,
    width: 190 * sf * underline.value
  }))
  const wipeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(wipe.value, [0, 1], [0, coverScale]) }]
  }))

  return (
    <Animated.View style={styles.root} pointerEvents="none">
      <LinearGradient
        colors={theme.bg}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ambient orbs */}
      <Animated.Image
        source={GLOW}
        style={[styles.orb, { width: 340 * sf, height: 340 * sf, left: -120 * sf, top: 120 * sf, opacity: 0.4 * theme.orbOpacity }]}
      />
      <Animated.Image
        source={GLOW}
        style={[styles.orb, { width: 300 * sf, height: 300 * sf, right: -110 * sf, top: height * 0.55, opacity: 0.32 * theme.orbOpacity }]}
      />
      <Animated.Image
        source={GLOW}
        style={[styles.orb, { width: 260 * sf, height: 260 * sf, left: 60 * sf, bottom: -80 * sf, opacity: 0.26 * theme.orbOpacity }]}
      />

      {/* glow behind pin */}
      <Animated.Image
        source={GLOW}
        style={[
          styles.center,
          glowStyle,
          { width: 460 * sf, height: 460 * sf, top: CY - 230 * sf }
        ]}
      />

      {/* intro ring pulses */}
      <Animated.View
        style={[
          styles.center,
          ring1Style,
          {
            width: 170 * sf,
            height: 170 * sf,
            top: CY - 85 * sf,
            borderRadius: 85 * sf,
            borderWidth: 2,
            borderColor: theme.ring
          }
        ]}
      />
      <Animated.View
        style={[
          styles.center,
          ring2Style,
          {
            width: 170 * sf,
            height: 170 * sf,
            top: CY - 85 * sf,
            borderRadius: 85 * sf,
            borderWidth: 2,
            borderColor: theme.ring
          }
        ]}
      />

      {/* green outro wipe (behind the pin, above bg) */}
      <Animated.View
        style={[
          styles.center,
          wipeStyle,
          {
            width: wipeBase,
            height: wipeBase,
            top: CY - wipeBase / 2 + 4 * sf,
            borderRadius: wipeBase / 2,
            backgroundColor: GREEN
          }
        ]}
      />

      {/* pin (brand-color + white crossfade layers) */}
      <Animated.View
        style={[
          styles.center,
          pinGroupStyle,
          { width: 158 * sf, height: 208 * sf, top: CY - 118 * sf }
        ]}
      >
        <Animated.Image source={PIN} style={[styles.fill, pinColorStyle]} resizeMode="contain" />
        <Animated.Image
          source={PIN}
          style={[styles.fill, pinWhiteStyle, { tintColor: '#ffffff' }]}
          resizeMode="contain"
        />
      </Animated.View>

      {/* wordmark: left-to-right wipe reveal */}
      <Animated.View
        style={[styles.center, wmWrapStyle, { width: 252 * sf, height: 42 * sf, top: CY + 110 * sf }]}
      >
        <Animated.View style={[styles.wmClip, wmClipStyle]}>
          <Animated.Image
            source={theme.wordmark}
            style={{ width: 252 * sf, height: 42 * sf }}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>

      {/* underline draw */}
      <Animated.View
        style={[
          styles.center,
          underlineStyle,
          { height: 3 * sf, top: CY + 168 * sf, borderRadius: 2, backgroundColor: theme.underline }
        ]}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject, zIndex: 999, overflow: 'hidden' },
  center: { position: 'absolute', alignSelf: 'center' },
  orb: { position: 'absolute' },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  wmClip: { overflow: 'hidden', height: '100%' }
})
