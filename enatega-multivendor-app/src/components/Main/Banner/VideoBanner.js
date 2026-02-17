import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function VideoBanner(props) {
  const appState = useRef(AppState.currentState);

  const player = useVideoPlayer(props?.source, (player) => {
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
      if (status.isLoaded) {
        console.log('Video loaded successfully');
      }
      
      if (status.error) {
        console.log('expo-video error:', status.error);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [player]);

  return (
    <View style={[styles.container, props?.style]}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
        contentFit="cover"
      />
      {props?.children}
    </View>
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
});