import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const STAGE = 168
const BASKET = 104
const LENS = 54
const FLOATERS = [
  { left: 18, delay: 0 },
  { left: STAGE - 38, delay: 900 },
  { left: STAGE / 2 + 26, delay: 1800 }
]

// A "?" bubble that drifts up from the basket and fades out, on a loop.
const Floater = ({ left, delay, color, background, animate }) => {
  const progress = useSharedValue(0)

  useEffect(() => {
    if (!animate) return
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2700, easing: Easing.out(Easing.quad) }), -1, false)
    )
  }, [animate, delay, progress])

  const style = useAnimatedStyle(() => ({
    opacity: progress.value < 0.15 ? progress.value / 0.15 : 1 - progress.value,
    transform: [
      { translateY: -progress.value * 46 },
      { scale: 0.7 + progress.value * 0.4 }
    ]
  }))

  if (!animate) return null

  return (
    <Animated.View style={[styles.floater, { left, backgroundColor: background }, style]}>
      <TextDefault bolder style={[styles.floaterText, { color }]}>?</TextDefault>
    </Animated.View>
  )
}

// Animated empty state for single-vendor search: a magnifier sweeps across an
// empty basket while question bubbles drift up. Uses brand and theme colours only.
const EmptySearch = ({ currentTheme, t, searchTerm }) => {
  const reduceMotion = useReducedMotion()
  const animate = !reduceMotion
  const sweep = useSharedValue(0)
  const halo = useSharedValue(0)
  const bob = useSharedValue(0)

  const brand = currentTheme?.singleVendorBrand
  const brandSubtle = currentTheme?.singleVendorBrandSubtle
  const brandForeground = currentTheme?.singleVendorBrandForeground
  const surface = currentTheme?.cardBackground || currentTheme?.themeBackground
  const muted = currentTheme?.colorTextMuted || currentTheme?.fontSecondColor

  useEffect(() => {
    if (!animate) return
    const ease = Easing.inOut(Easing.sin)
    sweep.value = withRepeat(
      withSequence(withTiming(1, { duration: 1300, easing: ease }), withTiming(-1, { duration: 1300, easing: ease })),
      -1,
      false
    )
    halo.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }), -1, false)
    bob.value = withRepeat(withTiming(1, { duration: 1600, easing: ease }), -1, true)
  }, [animate, sweep, halo, bob])

  const lensStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: sweep.value * 30 },
      { translateY: -Math.abs(sweep.value) * 8 },
      { rotate: `${sweep.value * 14}deg` }
    ]
  }))

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.5 * (1 - halo.value),
    transform: [{ scale: 1 + halo.value * 0.32 }]
  }))

  const basketStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value * -4 }]
  }))

  const shadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: 1 - bob.value * 0.12 }],
    opacity: 0.5 - bob.value * 0.15
  }))

  return (
    <Animated.View entering={FadeInDown.duration(380)} style={styles.container}>
      <View style={styles.stage}>
        {animate && <Animated.View style={[styles.halo, { borderColor: brand }, haloStyle]} />}
        <View style={[styles.disc, { backgroundColor: brandSubtle }]} />

        {FLOATERS.map((floater) => (
          <Floater
            key={floater.left}
            left={floater.left}
            delay={floater.delay}
            color={brandForeground}
            background={surface}
            animate={animate}
          />
        ))}

        <Animated.View style={[styles.basket, basketStyle]}>
          <Ionicons name='basket-outline' size={BASKET * 0.62} color={brandForeground} />
        </Animated.View>
        <Animated.View style={[styles.groundShadow, { backgroundColor: brand }, shadowStyle]} />

        <Animated.View style={[styles.lens, { backgroundColor: surface, borderColor: brand }, lensStyle]}>
          <Ionicons name='search' size={LENS * 0.48} color={brandForeground} />
        </Animated.View>
      </View>

      <TextDefault H3 bolder center style={styles.title}>
        {t('noProductsFound', { defaultValue: 'No products found' })}
      </TextDefault>
      <TextDefault center textColor={muted} style={styles.subtitle}>
        {searchTerm
          ? t('noProductsForTerm', {
            defaultValue: 'We couldn\'t find anything for "{{term}}". Try another keyword or check the spelling.',
            term: searchTerm
          })
          : t('No results found for your search. Please try a different query')}
      </TextDefault>
    </Animated.View>
  )
}

export default EmptySearch

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60
  },
  stage: {
    width: STAGE,
    height: STAGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18
  },
  halo: {
    position: 'absolute',
    width: STAGE - 20,
    height: STAGE - 20,
    borderRadius: (STAGE - 20) / 2,
    borderWidth: 2
  },
  disc: {
    position: 'absolute',
    width: STAGE - 20,
    height: STAGE - 20,
    borderRadius: (STAGE - 20) / 2
  },
  basket: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  groundShadow: {
    width: 58,
    height: 6,
    borderRadius: 3,
    marginTop: 2
  },
  lens: {
    position: 'absolute',
    top: 26,
    width: LENS,
    height: LENS,
    borderRadius: LENS / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },
  floater: {
    position: 'absolute',
    top: STAGE / 2 - 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  floaterText: {
    fontSize: 13,
    lineHeight: 16
  },
  title: {
    marginBottom: 8
  },
  subtitle: {
    lineHeight: 20,
    maxWidth: 300
  }
})
