import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function VideoBanner(props) {
  const video = React.useRef(null);
  
  React.useEffect(() => {
    if (video.current) {
      video.current.playAsync();
    }
  }, []);

  return (
    <View style={[styles.container, props?.style]}>
      <Video
        ref={video}
        style={styles.video}
        source={props?.source}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
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
    objectFit: 'cover'
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  }
});
