import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import useMultivendorTheme from '../useMultivendorTheme'

export const SkeletonBlock = ({ width = '100%', height = 16, borderRadius, style }) => {
  const { tokens } = useMultivendorTheme()
  const opacity = useRef(new Animated.Value(0.45)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 650, useNativeDriver: true })
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      style={[
        styles(tokens).block,
        {
          width,
          height,
          borderRadius: borderRadius ?? tokens.radii.sm,
          opacity
        },
        style
      ]}
    />
  )
}

export const SkeletonRow = ({ showDivider = true, style }) => {
  const { tokens } = useMultivendorTheme()
  const themedStyles = styles(tokens)

  return (
    <View style={[themedStyles.row, style]}>
      <SkeletonBlock width={tokens.sizes.touchTarget} height={tokens.sizes.touchTarget} borderRadius={tokens.radii.md} />
      <View style={themedStyles.lines}>
        <SkeletonBlock width='68%' height={12} />
        <SkeletonBlock width='42%' height={10} />
      </View>
      {showDivider && <View style={themedStyles.divider} />}
    </View>
  )
}

const styles = (tokens) => StyleSheet.create({
  block: {
    backgroundColor: tokens.colors.skeleton
  },
  row: {
    minHeight: tokens.sizes.headerContent + tokens.spacing.lg,
    marginHorizontal: tokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md
  },
  lines: {
    flex: 1,
    gap: tokens.spacing.sm
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: tokens.sizes.touchTarget + tokens.spacing.md,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.colors.borderSubtle
  }
})
