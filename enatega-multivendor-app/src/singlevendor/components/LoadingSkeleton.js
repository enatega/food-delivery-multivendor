import React, { useContext, useEffect, useRef } from 'react'
import { Animated, StyleSheet } from 'react-native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

const LoadingSkeleton = ({ width = '100%', height = 16, borderRadius = 8, style }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true
        })
      ])
    )

    animation.start()

    return () => animation.stop()
  }, [])

  return <Animated.View style={[styles(currentTheme).skeleton, { width, height, borderRadius, opacity }, style]} />
}

export default LoadingSkeleton

const styles = (currentTheme) => StyleSheet.create({
  skeleton: {
    backgroundColor: currentTheme.colorBgTertiary
  }
})
