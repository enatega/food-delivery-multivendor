import { LinearGradient } from 'expo-linear-gradient'
import LottieView from 'lottie-react-native'
import React, { useEffect, useState, useRef, useMemo } from 'react'
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

  // CloudFront signed URLs carry an expiring signature in the query string
  // (?Expires=...&Signature=...&Key-Pair-Id=...). The same image therefore
  // arrives with a different full URL every time the data is refetched, which
  // RN's <Image> treats as a brand-new image -> cache miss -> re-download ->
  // blank. We identify an image by its PATH (everything before the "?") so a
  // refreshed signature does not look like a new image.
  const pathKey = useMemo(() => {
    if (!hasValidUrl) return null
    const queryIndex = imageUrl.indexOf('?')
    return queryIndex === -1 ? imageUrl : imageUrl.slice(0, queryIndex)
  }, [imageUrl, hasValidUrl])

  // Keep the first valid signed URL we saw for a given path and only swap the
  // rendered source when the underlying image (path) actually changes. This
  // stops an already-loaded, cached image from being invalidated just because
  // its signature was refreshed by a background refetch. On a real remount
  // (e.g. navigating back) the refs re-initialise to the latest signed URL.
  const displayUrlRef = useRef(imageUrl)
  const lastPathRef = useRef(pathKey)
  if (pathKey !== lastPathRef.current) {
    lastPathRef.current = pathKey
    displayUrlRef.current = imageUrl
  }
  const displayUrl = displayUrlRef.current

  // Reset load state only when the underlying image changes. Keying on pathKey
  // (not the full signed URL) avoids re-triggering the shimmer on every
  // signature refresh, while still resetting stale state for recycled list
  // items and remounts on navigation.
  useEffect(() => {
    setImageLoaded(false)
    setImageError(false)
    fadeAnim.setValue(0)
  }, [pathKey, fadeAnim])

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
        source={{ uri: displayUrl }}
        onLoad={handleImageLoad}
        // onLoadEnd fires even for cached images where onLoad may be skipped
        // on iOS; this guarantees the image is revealed after navigating back.
        onLoadEnd={() => {
          if (!imageError) handleImageLoad()
        }}
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