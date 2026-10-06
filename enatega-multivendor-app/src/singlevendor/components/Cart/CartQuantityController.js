import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useDebouncedCartQuantity from '../../hooks/useDebouncedCartQuantity'

// Tactile feedback without a haptics module: every tap gets an immediate
// squish on the button, a pulse on the pill, and the number rolls in the
// direction of the change so rapid taps read as 4 -> 5 -> 6.
const useTapFeedback = () => {
  const plusScale = useRef(new Animated.Value(1)).current
  const minusScale = useRef(new Animated.Value(1)).current
  const pillPulse = useRef(new Animated.Value(0)).current

  const squish = (value) => {
    value.stopAnimation()
    value.setValue(0.78)
    Animated.spring(value, { toValue: 1, friction: 4, tension: 260, useNativeDriver: true }).start()
  }

  const pulse = () => {
    pillPulse.stopAnimation()
    pillPulse.setValue(1)
    Animated.timing(pillPulse, { toValue: 0, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }).start()
  }

  return {
    plusScale,
    minusScale,
    pillPulse,
    tapPlus: () => { squish(plusScale); pulse() },
    tapMinus: () => { squish(minusScale); pulse() }
  }
}

const RollingCount = ({ value, style, textColor }) => {
  const shift = useRef(new Animated.Value(0)).current
  const fade = useRef(new Animated.Value(1)).current
  const previous = useRef(value)

  useEffect(() => {
    if (previous.current === value) return
    const direction = value > previous.current ? 1 : -1
    previous.current = value
    shift.stopAnimation()
    fade.stopAnimation()
    // New number enters from below on +, from above on -.
    shift.setValue(direction * 10)
    fade.setValue(0.2)
    Animated.parallel([
      Animated.spring(shift, { toValue: 0, friction: 6, tension: 220, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 140, useNativeDriver: true })
    ]).start()
  }, [value, shift, fade])

  return (
    <Animated.View style={[style, { opacity: fade, transform: [{ translateY: shift }] }]}>
      <TextDefault H6 bolder textColor={textColor}>
        {value}
      </TextDefault>
    </Animated.View>
  )
}

const CartQuantityController = ({ foodId, categoryId, variationId, addons = [], defaultQuantity = 0, collapsedWhenZero = false, variant = 'overlay', isOutOfStock = false, product = null }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const isRTL = i18n.dir() === 'rtl'
  const currentTheme = useMemo(() => ({ isRTL, ...theme[themeContext.ThemeValue] }), [isRTL, themeContext.ThemeValue])
  const s = useMemo(() => styles(currentTheme), [currentTheme])

  // Quantity updates optimistically; server sync runs in the background and never blocks taps.
  const { quantity, increase, decrease } = useDebouncedCartQuantity({
    foodId,
    categoryId,
    variationId,
    addons,
    defaultQuantity,
    product
  })

  const { plusScale, minusScale, pillPulse, tapPlus, tapMinus } = useTapFeedback()
  const appearAnim = useRef(new Animated.Value(1)).current
  const addPop = useRef(new Animated.Value(1)).current
  const wasCollapsedRef = useRef(collapsedWhenZero && quantity === 0)

  const shouldShowController = !(collapsedWhenZero && quantity === 0)

  useEffect(() => {
    if (!shouldShowController) {
      wasCollapsedRef.current = true
      return
    }
    if (!wasCollapsedRef.current) return
    wasCollapsedRef.current = false
    // Expand from a near-full size so the +/- pill is readable on the very
    // first frame after the tap, then settle with a short spring.
    appearAnim.setValue(0.72)
    Animated.spring(appearAnim, { toValue: 1, friction: 5, tension: 240, useNativeDriver: true }).start()
  }, [shouldShowController, appearAnim])

  const onAdd = () => {
    addPop.setValue(0.75)
    Animated.spring(addPop, { toValue: 1, friction: 4, tension: 260, useNativeDriver: true }).start()
    increase()
  }
  const onIncrease = () => {
    tapPlus()
    increase()
  }
  const onDecrease = () => {
    tapMinus()
    decrease()
  }

  if (!shouldShowController) {
    return (
      <Animated.View style={[s.addButtonWrap, variant === 'details' && s.addButtonWrapLarge, { transform: [{ scale: addPop }] }]}>
        <Pressable
          style={({ pressed }) => [s.addButton, variant === 'details' && s.addButtonLarge, isOutOfStock && s.disabledButton, pressed && !isOutOfStock && s.addButtonPressed]}
          onPress={onAdd}
          disabled={isOutOfStock}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityState={{ disabled: isOutOfStock }}
          accessibilityLabel={isOutOfStock ? 'Out of stock' : 'Add to cart'}
        >
          <AntDesign name='plus' size={14} color={currentTheme.singleVendorBrandForeground} />
        </Pressable>
      </Animated.View>
    )
  }

  const pulseRing = {
    opacity: pillPulse.interpolate({ inputRange: [0, 1], outputRange: [0, 0.55] }),
    transform: [{ scale: pillPulse.interpolate({ inputRange: [0, 1], outputRange: [1.12, 1] }) }]
  }

  return (
    <Animated.View style={[s.controller, variant === 'details' && s.controllerLarge, { transform: [{ scale: appearAnim }] }]}>
      <Animated.View pointerEvents='none' style={[s.pulseRing, pulseRing]} />

      <Animated.View style={{ transform: [{ scale: minusScale }] }}>
        <Pressable
          style={s.controlButton}
          onPress={onDecrease}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityLabel={quantity <= 1 ? 'Remove from cart' : 'Decrease quantity'}
        >
          <AntDesign name={quantity <= 1 ? 'delete' : 'minus'} size={14} color={currentTheme.singleVendorOnBrand} />
        </Pressable>
      </Animated.View>

      <View style={s.countContainer}>
        <RollingCount value={quantity} style={s.countSlot} textColor={currentTheme.fontMainColor} />
      </View>

      <Animated.View style={{ transform: [{ scale: plusScale }] }}>
        <Pressable
          style={[s.controlButton, isOutOfStock && s.disabledButton]}
          onPress={onIncrease}
          disabled={isOutOfStock}
          hitSlop={8}
          accessibilityRole='button'
          accessibilityLabel='Increase quantity'
          accessibilityState={{ disabled: isOutOfStock }}
        >
          <AntDesign name='plus' size={14} color={currentTheme.singleVendorOnBrand} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    addButtonWrap: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 1
    },
    addButtonWrapLarge: {
      position: 'relative',
      top: 0,
      right: 0
    },
    addButtonPressed: {
      opacity: 0.8
    },
    pulseRing: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: currentTheme.singleVendorBrand
    },
    addButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: currentTheme.colorBgPrimary || currentTheme.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      shadowColor: currentTheme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2
    },
    addButtonLarge: {
      width: 28,
      height: 28,
      borderRadius: 14
    },
    disabledButton: {
      opacity: 0.45,
      shadowOpacity: 0,
      elevation: 0
    },
    controller: {
      position: 'absolute',
      top: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme.colorBgPrimary || currentTheme.cardBackground,
      borderRadius: 16,
      paddingHorizontal: 4,
      paddingVertical: 4,
      shadowColor: currentTheme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: currentTheme.singleVendorBrand
    },
    controllerLarge: {
      position: 'relative',
      top: 0,
      right: 0,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 16
    },
    controlButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme.singleVendorBrand
    },
    pressedButton: {
      opacity: 0.65,
      transform: [{ scale: 0.9 }]
    },
    countContainer: {
      minWidth: 24,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4
    },
    countSlot: {
      minWidth: 20,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center'
    },
    countSpinner: {
      position: 'absolute'
    }
  })

export default CartQuantityController
