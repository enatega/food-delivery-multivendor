import React, { useContext, useEffect, useMemo, useRef } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import useDebouncedCartQuantity from '../../hooks/useDebouncedCartQuantity'

const CartQuantityController = ({
  foodId,
  categoryId,
  variationId,
  addons = [],
  defaultQuantity = 0,
  collapsedWhenZero = false,
  variant = 'overlay'
}) => {
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

  const showCount = !isLoading

  const appearAnim = useRef(new Animated.Value(0)).current
  const countAnim = useRef(new Animated.Value(0)).current
  const prevQuantityRef = useRef(quantity)

  const shouldShowController = !(collapsedWhenZero && quantity === 0)

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

  useEffect(() => {
    if (quantity === prevQuantityRef.current) return
    prevQuantityRef.current = quantity
    countAnim.setValue(12)
    Animated.parallel([
      Animated.timing(countAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true
      })
    ]).start()
  }, [quantity, countAnim])

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

  const countAnimatedStyle = useMemo(
    () => ({
      transform: [{ translateY: countAnim }],
      opacity: countAnim.interpolate({
        inputRange: [0, 12],
        outputRange: [1, 0]
      })
    }),
    [countAnim]
  )

  if (collapsedWhenZero && quantity === 0) {
    return (
      <Pressable
        style={[styles(currentTheme).addButton, variant === 'details' && styles(currentTheme).addButtonLarge]}
        onPress={increase}
        disabled={isLoading}
      >
        {isLoading ? <DotLoader color="#000000" /> : <AntDesign name='plus' size={14} color="#000000" />}
      </Pressable>
    )
  }

  return (
    <Animated.View
      style={[
        styles(currentTheme).controller,
        variant === 'details' && styles(currentTheme).controllerLarge,
        controllerAnimatedStyle
      ]}
    >
      <Pressable
        style={styles(currentTheme).controlButton}
        onPress={decrease}
        disabled={isLoading}
      >
        <AntDesign name={quantity <= 1 ? 'delete' : 'minus'} size={14} color="#FFFFFF" />
      </Pressable>

      <View style={styles(currentTheme).countContainer}>
        <View style={styles(currentTheme).countSlot}>
          {showCount && (
            <Animated.View style={countAnimatedStyle}>
              <TextDefault H6 bolder textColor={currentTheme.fontMainColor}>
                {quantity}
              </TextDefault>
            </Animated.View>
          )}
          {isLoading && (
            <View style={styles(currentTheme).countSpinner}>
              <DotLoader color={currentTheme.primaryBlue || '#0EA5E9'} />
            </View>
          )}
        </View>
      </View>

      <Pressable
        style={styles(currentTheme).controlButton}
        onPress={increase}
        disabled={isLoading}
      >
        <AntDesign name='plus' size={14} color="#FFFFFF" />
      </Pressable>
    </Animated.View>
  )
}

const DotLoader = ({ color, size = 3, gap = 2 }) => {
  const d1 = useRef(new Animated.Value(0)).current
  const d2 = useRef(new Animated.Value(0)).current
  const d3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const pulse = (val) =>
      Animated.sequence([
        Animated.timing(val, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.timing(val, { toValue: 0, duration: 260, useNativeDriver: true })
      ])

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
      backgroundColor: currentTheme.white,
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
    controller: {
      position: 'absolute',
      top: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: currentTheme.white,
      borderRadius: 16,
      paddingHorizontal: 4,
      paddingVertical: 4,
      shadowColor: currentTheme.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      borderWidth: 1,
      borderColor: currentTheme.primaryBlue || '#0EA5E9'
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
      backgroundColor: currentTheme.primaryBlue || '#0EA5E9'
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
    },
  })

export default CartQuantityController
