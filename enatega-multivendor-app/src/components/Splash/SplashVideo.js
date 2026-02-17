import { StyleSheet, View, AppState } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function SplashVideo({ onLoaded, onFinish }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const appState = useRef(AppState.currentState);

  const player = useVideoPlayer(require('./../../../assets/mobileSplash.mp4'), (player) => {
    player.loop = false;
    player.muted = true;
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/active/) && nextAppState === 'background') {
        player.pause();
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [player]);

  useEffect(() => {
    const playTimeout = setTimeout(() => {
      if (AppState.currentState === 'active') {
        player.play();
      }
    }, 500);

    const statusSubscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay' && !hasLoaded) {
        setHasLoaded(true);
        onLoaded?.();
        if (AppState.currentState === 'active') {
          player.play();
        }
      }
      
      if (status.status === 'idle' && hasLoaded && !hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    const endSubscription = player.addListener('playToEnd', () => {
      if (!hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    const timeout = setTimeout(() => {
      if (hasLoaded && !hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    }, 5000);

    return () => {
      clearTimeout(playTimeout);
      statusSubscription?.remove();
      endSubscription?.remove();
      clearTimeout(timeout);
    };
  }, [player, hasLoaded, hasFinished, onLoaded, onFinish]);

  return (
    <View style={{ flex: 1 }}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit="cover"
      />
    </View>
  );
}