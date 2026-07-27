import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useTranslation } from 'react-i18next';
import { captureException } from '../../../utils/crashReporter';

class VideoPlaybackBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    captureException(error, {
      feature: 'discovery-video-banner',
      componentStack: info?.componentStack
    });
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function VideoFallback({ message, style }) {
  return (
    <View style={[styles.container, style, styles.fallback]}>
      <Text style={styles.fallbackText}>{message}</Text>
    </View>
  );
}

function ActiveVideoBanner({ sourceUri, onPlaybackError, ...props }) {
  const appState = useRef(AppState.currentState);

  const player = useVideoPlayer(sourceUri, (player) => {
    player.loop = true;
    player.muted = true;
    if (AppState.currentState === 'active') {
      player.play();
    }
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        player.pause();
      } else if (nextAppState === 'active') {
        player.play();
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [player]);

  useEffect(() => {
    const subscription = player.addListener('statusChange', (status) => {
      if (status.error) {
        const error = status.error instanceof Error
          ? status.error
          : new Error(status.error?.message || 'Video playback failed');
        captureException(error, {
          feature: 'discovery-video-banner'
        });
        onPlaybackError(true);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [onPlaybackError, player]);

  return (
    <View style={[styles.container, props?.style]}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit="cover"
        onFirstFrameRender={props?.onFirstFrameRender}
      />
      {props?.children}
    </View>
  );
}

export default function VideoBanner(props) {
  const { t } = useTranslation();
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const sourceUri = typeof props?.source === 'string'
    ? props.source
    : props?.source?.uri || '';
  const fallback = <VideoFallback message={t('videoPlaybackUnavailable')} style={props?.style} />;

  if (playbackFailed) return fallback;

  return (
    <VideoPlaybackBoundary key={sourceUri} fallback={fallback}>
      <ActiveVideoBanner
        {...props}
        sourceUri={sourceUri}
        onPlaybackError={setPlaybackFailed}
      />
    </VideoPlaybackBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 8,
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  fallback: {
    backgroundColor: '#1F2937',
  },
  fallbackText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});
