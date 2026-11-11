import React, { useEffect, useRef } from 'react'
import { Image, StyleSheet, View } from 'react-native'

const SPLASH_IMAGE = require('../../../assets/splash-image.png')

export default function StaticSplash({
  ready = true,
  minDuration = 2400,
  onFinish
}) {
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    if (!ready) return

    const elapsed = Date.now() - mountedAt.current
    const timeout = setTimeout(() => onFinish?.(), Math.max(0, minDuration - elapsed))

    return () => clearTimeout(timeout)
  }, [ready, minDuration, onFinish])

  return (
    <View style={styles.root} pointerEvents='none'>
      <Image source={SPLASH_IMAGE} resizeMode='cover' style={styles.image} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ffffff',
    zIndex: 9999
  },
  image: StyleSheet.absoluteFillObject
})
