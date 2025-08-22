import { LinearGradient } from 'expo-linear-gradient'
import LottieView from 'lottie-react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Animated, StyleSheet, View, Image } from 'react-native'
import CartItemPlaceholder from '../../assets/images/CartItemPlaceholder.png'

const ShimmerImage = ({ imageUrl, style, resizeMode = 'cover', defaultSource }) => {
  // Check if we have a valid image URL
  const hasValidUrl = imageUrl && imageUrl.trim().length > 0

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const shimmerAnimation = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const imagePath = require('../../assets/SVG/ShiimerImagePlaceholder.json')

  // Only start shimmer animation if we have a valid URL and image hasn't loaded
  useEffect(() => {
    if (hasValidUrl && !imageLoaded && !imageError) {
      const shimmerLoop = Animated.loop(
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
      shimmerLoop.start()

      // Cleanup function to stop animation
      return () => {
        shimmerLoop.stop()
      }
    }
  }, [hasValidUrl, imageLoaded, imageError, shimmerAnimation])

  // Fade in image when loaded
  useEffect(() => {
    if (imageLoaded && !imageError) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start()
    }
  }, [imageLoaded, imageError, fadeAnim])

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200]
  })

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  // If we don't have a valid URL or image failed to load, show placeholder
  if (!hasValidUrl || imageError) {
    return (
      <View style={[styles.container, style]}>
        {defaultSource ? (
          <Image
            source={defaultSource}
            style={[StyleSheet.absoluteFill]}
            resizeMode={resizeMode}
          />
        ) : (
          <LottieView
            style={{
              width: '100%',
              height: '100%'
            }}
            source={imagePath}
            autoPlay
            loop
            speed={0.35}
            resizeMode="cover"
          />
        )}
      </View>
    )
  }

  // If we have a valid URL, show shimmer while loading, then the image
  return (
    <View style={[styles.container, style]}>
      {/* Show shimmer only while loading */}
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

      {/* Main image */}
      <Animated.Image
        source={{ uri: imageUrl }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: imageLoaded ? fadeAnim : 0
          }
        ]}
        resizeMode={resizeMode}
        // Remove defaultSource prop as it can cause flashing
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
  }
})

export default ShimmerImage