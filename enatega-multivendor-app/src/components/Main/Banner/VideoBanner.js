import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function VideoBanner(props) {
  const appState = useRef(AppState.currentState);

  // Extract URI from source - handle both string and object formats
  const sourceUri = typeof props?.source === 'string' 
    ? props.source 
    : props?.source?.uri || '';

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
      if (status.isLoaded) {
        console.log('Video loaded successfully from:', sourceUri);
      }
      
      if (status.error) {
        console.error('expo-video error:', status.error);
        console.error('Video source:', sourceUri);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [player, sourceUri]);

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
