import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { VideoView, useVideoPlayer } from 'expo-video'

export default function VideoBanner({ source, shouldPlay, children, style }) {
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

    if (shouldPlay) {
      player.play()
    } else {
      player.pause()

      // Important: reset frame so decoder stops rendering
      try {
        player.seekTo(0)
      } catch (e) {}
    }
  }, [shouldPlay, player])

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
