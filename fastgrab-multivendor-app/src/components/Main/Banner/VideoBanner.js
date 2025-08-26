import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function VideoBanner(props) {
  // Create video player instance
  const player = useVideoPlayer(props?.source, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener('statusChange', (status) => {
      if (status.isLoaded) {
        // Video is ready to play
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