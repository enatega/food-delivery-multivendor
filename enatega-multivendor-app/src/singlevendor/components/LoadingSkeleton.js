import React, { useEffect, useRef } from 'react'
import { Animated, View, StyleSheet } from 'react-native'

const LoadingSkeleton = ({ width = '100%', height = 16, borderRadius = 8, style }) => {
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

  return <Animated.View style={[styles.skeleton, { width, height, borderRadius, opacity }, style]} />
}

export default LoadingSkeleton

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E1E1'
  }
})
