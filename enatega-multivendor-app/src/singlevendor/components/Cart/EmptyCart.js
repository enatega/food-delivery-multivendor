import React, { useContext, useEffect, useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { scale } from '../../../utils/scaling'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'

const STAGE = scale(180)
const DISC = STAGE - scale(24)
const CART = scale(76)
const CHIP = scale(36)

// Items that orbit the empty cart, waiting to be added.
const CHIPS = [
  { icon: 'nutrition-outline', top: scale(18), left: scale(8), delay: 0 },
  { icon: 'cafe-outline', top: scale(6), left: STAGE - CHIP - scale(18), delay: 500 },
  { icon: 'fast-food-outline', top: STAGE - CHIP - scale(38), left: STAGE - CHIP - scale(2), delay: 1000 }
]

const FloatingChip = ({ icon, top, left, delay, colors, animate }) => {
  const float = useSharedValue(0)

  useEffect(() => {
    if (!animate) return
    float.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.sin) }), -1, true)
    )
  }, [animate, delay, float])

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -float.value * 6 }, { rotate: `${(float.value - 0.5) * 10}deg` }]
  }))

  return (
    <Animated.View
      style={[
        styles.chip,
        { top, left, backgroundColor: colors.surface, borderColor: colors.border },
        style
      ]}
    >
      <Ionicons name={icon} size={CHIP * 0.5} color={colors.foreground} />
    </Animated.View>
  )
}

// Empty cart drawn from theme tokens (brand green + surfaces), so it reads
// correctly in both light and dark mode instead of a fixed bitmap.
const EmptyCart = ({ onStartShopping }) => {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const reduceMotion = useReducedMotion()
  const animate = !reduceMotion
  const bob = useSharedValue(0)

  const colors = useMemo(() => ({
    brand: currentTheme.singleVendorBrand,
    onBrand: currentTheme.singleVendorOnBrand,
    subtle: currentTheme.singleVendorBrandSubtle,
    foreground: currentTheme.singleVendorBrandForeground,
    surface: currentTheme.cardBackground || currentTheme.themeBackground,
    border: currentTheme.colorBorder || currentTheme.newBorderColor2,
    text: currentTheme.fontMainColor,
    muted: currentTheme.colorTextMuted || currentTheme.fontSecondColor
  }), [currentTheme])

  useEffect(() => {
    if (!animate) return
    bob.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }), -1, true)
  }, [animate, bob])

  const cartStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -bob.value * 5 }, { rotate: `${(bob.value - 0.5) * -4}deg` }]
  }))

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 - bob.value * 0.12,
    transform: [{ scaleX: 1 - bob.value * 0.14 }]
  }))

  return (
    <Animated.View entering={FadeInDown.duration(380)} style={styles.container}>
      <View style={styles.stage}>
        <View style={[styles.disc, { backgroundColor: colors.subtle }]} />
        <View style={[styles.ring, { borderColor: colors.border }]} />

        {CHIPS.map((chip) => (
          <FloatingChip key={chip.icon} {...chip} colors={colors} animate={animate} />
        ))}

        <Animated.View style={[styles.cartTile, { backgroundColor: colors.surface, borderColor: colors.border }, cartStyle]}>
          <Ionicons name='cart-outline' size={CART * 0.58} color={colors.foreground} />
          <View style={[styles.badge, { backgroundColor: colors.brand, borderColor: colors.surface }]}>
            <TextDefault bolder style={[styles.badgeText, { color: colors.onBrand }]}>0</TextDefault>
          </View>
        </Animated.View>
        <Animated.View style={[styles.shadow, { backgroundColor: colors.foreground }, shadowStyle]} />
      </View>

      <TextDefault textColor={colors.text} bolder H3 center style={styles.title}>
        {t('yourCartIsEmpty', { defaultValue: 'Your cart is empty' })}
      </TextDefault>
      <TextDefault textColor={colors.muted} Normal center style={styles.description}>
        {t('emptyCartDescription', {
          defaultValue: 'When you add items from a store, your order will be right here, so you can make changes whenever you want.'
        })}
      </TextDefault>

      <Pressable
        accessibilityRole='button'
        onPress={onStartShopping}
        style={({ pressed }) => [styles.button, { backgroundColor: colors.brand }, pressed && styles.buttonPressed]}
      >
        <Ionicons name='storefront-outline' size={scale(17)} color={colors.onBrand} />
        <TextDefault bolder H5 style={{ color: colors.onBrand }}>
          {t('startShopping', { defaultValue: 'Start shopping' })}
        </TextDefault>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(24),
    paddingVertical: scale(40)
  },
  stage: {
    width: STAGE,
    height: STAGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(22)
  },
  disc: {
    position: 'absolute',
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2
  },
  ring: {
    position: 'absolute',
    width: STAGE,
    height: STAGE,
    borderRadius: STAGE / 2,
    borderWidth: 1,
    borderStyle: 'dashed'
  },
  cartTile: {
    width: CART + scale(20),
    height: CART + scale(20),
    borderRadius: scale(28),
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4
  },
  badge: {
    position: 'absolute',
    top: scale(10),
    right: scale(10),
    minWidth: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(4)
  },
  badgeText: {
    fontSize: scale(11),
    lineHeight: scale(14)
  },
  shadow: {
    width: scale(64),
    height: scale(7),
    borderRadius: scale(4),
    marginTop: scale(10)
  },
  chip: {
    position: 'absolute',
    width: CHIP,
    height: CHIP,
    borderRadius: CHIP / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  title: {
    marginBottom: scale(8)
  },
  description: {
    paddingHorizontal: scale(12),
    lineHeight: scale(20),
    maxWidth: scale(320),
    marginBottom: scale(26)
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    height: scale(46),
    paddingHorizontal: scale(28),
    borderRadius: 999,
    minWidth: scale(200)
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }]
  }
})

export default EmptyCart
