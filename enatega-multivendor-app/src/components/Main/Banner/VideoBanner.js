import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, AppState } from 'react-native'
import { VideoView, useVideoPlayer } from 'expo-video'

export default function VideoBanner({ source, shouldPlay, children, style }) {
  const appState = useRef(AppState.currentState)
  // Correct way to enable caching
  const player = useVideoPlayer(
    {
      uri: source?.uri,
      useCaching: true
    },
    (player) => {
      player.loop = true
      player.muted = true
    }
  )

  // MAIN CONTROL: parent slider decides playback
  useEffect(() => {
    if (!player) return

    if (shouldPlay && AppState.currentState === 'active') {
      player.play()
    } else {
      player.pause()

      // Important: reset frame so decoder stops rendering
      try {
        player.seekTo(0)
      } catch (e) {}
    }
  }, [shouldPlay, player])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        player.pause()
      } else if (nextAppState === 'active') {
        player.play()
      }
      appState.current = nextAppState
    })

    return () => subscription?.remove()
  }, [player])

  return (
    <View style={[styles.container, style]}>
      <VideoView style={styles.video} player={player} allowsFullscreen={false} allowsPictureInPicture={false} nativeControls={false} contentFit='cover' />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
})
