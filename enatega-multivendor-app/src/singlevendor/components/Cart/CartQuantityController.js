import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useDebouncedCartQuantity from '../../hooks/useDebouncedCartQuantity'

const CartQuantityController = ({ foodId, categoryId, variationId, addons = [], defaultQuantity = 0, collapsedWhenZero = false, variant = 'overlay', isOutOfStock = false }) => {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  const { quantity, increase, decrease, isLoading } = useDebouncedCartQuantity({
    foodId,
    categoryId,
    variationId,
    addons,
    defaultQuantity
  })

  // Keep the optimistic quantity visible while the server synchronizes.
  const showCount = true

  const appearAnim = useRef(new Animated.Value(0)).current

  const shouldShowController = !(collapsedWhenZero && quantity === 0)
  const canChangeWhileSyncing = !collapsedWhenZero

  useEffect(() => {
    if (!shouldShowController) return
    appearAnim.setValue(0)
    Animated.spring(appearAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 90
    }).start()
  }, [shouldShowController, appearAnim])

  const controllerAnimatedStyle = useMemo(
    () => ({
      transform: [
        { scale: appearAnim },
        {
          translateY: appearAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [6, 0]
          })
        }
      ],
      opacity: appearAnim
    }),
    [appearAnim]
  )

  if (collapsedWhenZero && quantity === 0) {
    return (
      <Pressable style={[styles(currentTheme).addButton, variant === 'details' && styles(currentTheme).addButtonLarge, isOutOfStock && styles(currentTheme).disabledButton]} onPress={increase} disabled={isLoading || isOutOfStock} accessibilityRole='button' accessibilityState={{ disabled: isLoading || isOutOfStock }} accessibilityLabel={isOutOfStock ? 'Out of stock' : 'Add to cart'}>
        {isLoading ? <DotLoader color={currentTheme.singleVendorBrandForeground} /> : <AntDesign name='plus' size={14} color={currentTheme.singleVendorBrandForeground} />}
      </Pressable>
    )
  }

  return (
    <Animated.View style={[styles(currentTheme).controller, variant === 'details' && styles(currentTheme).controllerLarge, controllerAnimatedStyle]}>
      <Pressable
        style={({ pressed }) => [styles(currentTheme).controlButton, pressed && styles(currentTheme).pressedButton]}
        onPress={decrease}
        disabled={isLoading && !canChangeWhileSyncing}
        hitSlop={6}
        accessibilityState={{ disabled: isLoading && !canChangeWhileSyncing }}
      >
        <AntDesign name={quantity <= 1 ? 'delete' : 'minus'} size={14} color={currentTheme.singleVendorOnBrand} />
      </Pressable>

      <View style={styles(currentTheme).countContainer}>
        <View style={styles(currentTheme).countSlot}>
          {showCount && (
            <TextDefault H6 bolder textColor={currentTheme.fontMainColor}>
              {quantity}
            </TextDefault>
          )}
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles(currentTheme).controlButton, isOutOfStock && styles(currentTheme).disabledButton, pressed && !isOutOfStock && styles(currentTheme).pressedButton]}
        onPress={increase}
        disabled={isOutOfStock}
        hitSlop={6}
        accessibilityState={{ disabled: isOutOfStock }}
      >
        <AntDesign name='plus' size={14} color={currentTheme.singleVendorOnBrand} />
      </Pressable>
    </Animated.View>
  )
}

const DotLoader = ({ color, size = 3, gap = 2 }) => {
  const d1 = useRef(new Animated.Value(0)).current
  const d2 = useRef(new Animated.Value(0)).current
  const d3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const pulse = (val) => Animated.sequence([Animated.timing(val, { toValue: 1, duration: 260, useNativeDriver: true }), Animated.timing(val, { toValue: 0, duration: 260, useNativeDriver: true })])

    const animation = Animated.loop(Animated.stagger(120, [pulse(d1), pulse(d2), pulse(d3)]))
    animation.start()
    return () => animation.stop()
  }, [d1, d2, d3])

  const dotStyle = (val) => ({
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      {
        translateY: val.interpolate({ inputRange: [0, 1], outputRange: [2, 0] })
      }
    ]
  })

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Animated.View style={[{ backgroundColor: color, width: size, height: size, borderRadius: size / 2, marginRight: gap }, dotStyle(d1)]} />
      <Animated.View style={[{ backgroundColor: color, width: size, height: size, borderRadius: size / 2, marginRight: gap }, dotStyle(d2)]} />
      <Animated.View style={[{ backgroundColor: color, width: size, height: size, borderRadius: size / 2 }, dotStyle(d3)]} />
    </View>
  )
}

const styles = (currentTheme) =>
  StyleSheet.create({
    addButton: {
      position: 'absolute',
      top: 8,
      right: 8,
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
      position: 'relative',
      top: 0,
      right: 0,
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
      width: 20,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center'
    },
    countSpinner: {
      position: 'absolute'
    }
  })

export default CartQuantityController
