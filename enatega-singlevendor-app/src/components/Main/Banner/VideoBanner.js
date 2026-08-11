import React, { useRef, useEffect, useState } from 'react'
import { View, Text, StyleSheet, AppState, ImageBackground } from 'react-native'
import { VideoView, useVideoPlayer } from 'expo-video'
import { useTranslation } from 'react-i18next'
import { captureException } from '../../../utils/crashReporter'

class VideoPlaybackBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    captureException(error, {
      feature: 'discovery-video-banner',
      componentStack: info?.componentStack
    })
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

function VideoFallback({ message, style }) {
  return (
    <View style={[styles.container, style, styles.fallback]}>
      <Text style={styles.fallbackText}>{message}</Text>
    </View>
  )
}

function ActiveVideoBanner({ sourceUri, onPlaybackError, onFirstFrameReady, ...props }) {
  const appState = useRef(AppState.currentState)
  const shouldPlay = !!props?.shouldPlay

  const player = useVideoPlayer(sourceUri, (player) => {
    player.loop = true
    player.muted = true
    if (AppState.currentState === 'active' && shouldPlay) {
      player.play()
    }
  })

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        player.pause()
      } else if (nextAppState === 'active' && shouldPlay) {
        player.play()
      } else if (nextAppState === 'active') {
        player.pause()
      }
      appState.current = nextAppState
    })

    return () => subscription?.remove()
  }, [player, shouldPlay])

  useEffect(() => {
    if (AppState.currentState !== 'active') return

    if (shouldPlay) {
      player.play()
      return
    }

    player.pause()
  }, [player, shouldPlay])

  useEffect(() => {
    const subscription = player.addListener('statusChange', (status) => {
      if (status.error) {
        const error = status.error instanceof Error ? status.error : new Error(status.error?.message || 'Video playback failed')
        captureException(error, {
          feature: 'discovery-video-banner'
        })
        onPlaybackError(true)
      }
    })

    return () => {
      subscription?.remove()
    }
  }, [onPlaybackError, player])

  return (
    <View style={[styles.container, props?.style]}>
      {props?.posterUri ? <ImageBackground source={{ uri: props.posterUri }} style={styles.video} resizeMode='cover' /> : null}
      <VideoView
        style={[styles.video, !shouldPlay && styles.inactiveVideo]}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit='cover'
        onFirstFrameRender={() => {
          onFirstFrameReady?.()
          props?.onFirstFrameRender?.()
        }}
      />
      {props?.children}
    </View>
  )
}

export default function VideoBanner(props) {
  const { t } = useTranslation()
  const [playbackFailed, setPlaybackFailed] = useState(false)
  const [hasFirstFrame, setHasFirstFrame] = useState(false)
  const sourceUri = typeof props?.source === 'string' ? props.source : props?.source?.uri || ''
  const fallback = <VideoFallback message={t('videoPlaybackUnavailable')} style={props?.style} />

  useEffect(() => {
    setPlaybackFailed(false)
    setHasFirstFrame(false)
  }, [sourceUri])

  if (playbackFailed) return fallback

  return (
    <VideoPlaybackBoundary key={sourceUri} fallback={fallback}>
      <ActiveVideoBanner {...props} sourceUri={sourceUri} onPlaybackError={setPlaybackFailed} onFirstFrameReady={() => setHasFirstFrame(true)} posterUri={!hasFirstFrame ? props?.posterUri : null} />
    </VideoPlaybackBoundary>
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
  },
  inactiveVideo: {
    opacity: 1
  },
  fallback: {
    backgroundColor: '#1F2937'
  },
  fallbackText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600'
  }
})
