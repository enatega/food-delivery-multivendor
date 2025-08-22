import React, { useEffect, useState, useRef } from 'react'
import { View, Animated, StyleSheet, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import CartItemPlaceholder from '../../assets/images/CartItemPlaceholder.png'
import LottieView from 'lottie-react-native'

const ShimmerImage = ({ imageUrl, style }) => {

  const hasValidUrl = imageUrl && imageUrl.trim().length > 0

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const shimmerAnimation = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const animationRef = useRef(null)
  
  const imagePath = require('../../assets/SVG/ShiimerImagePlaceholder.json')

  useEffect(() => {
    if (hasValidUrl && !imageLoaded && !imageError) {
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          })
        ])
      )
      animationRef.current.start()
    }

    // Cleanup animation
    return () => {
      if (animationRef.current) {
        animationRef.current.stop()
      }
    }
  }, [hasValidUrl, imageLoaded, imageError])

  // Fade in image when loaded
  useEffect(() => {
    if (imageLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start()
    }
  }, [imageLoaded])

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200]
  })

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }


  if (!hasValidUrl || imageError) {
    return (
      <View style={[styles.container, style]}>
        <LottieView
          style={styles.lottie}
          source={imagePath}
          autoPlay
          loop
          speed={0.35}
          resizeMode='cover'
        />
      </View>
    )
  }

  // If we have a valid URL, show shimmer while loading
  return (
    <View style={[styles.container, style]}>
      {!imageLoaded && (
        <View style={[StyleSheet.absoluteFill, styles.shimmerContainer]}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }]
              }
            ]}
          >
            <LinearGradient
              colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      )}

      <Animated.Image
        source={{ uri: imageUrl }}
        onLoad={() => setImageLoaded(true)}
        onError={handleImageError}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: fadeAnim
          }
        ]}
        resizeMode='cover'
        defaultSource={CartItemPlaceholder}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f0f0f0'
  },
  shimmerContainer: {
    overflow: 'hidden'
  },
  shimmer: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  lottie: {
    width: '100%',
    height: '100%'
  }
})

export default React.memo(ShimmerImage)