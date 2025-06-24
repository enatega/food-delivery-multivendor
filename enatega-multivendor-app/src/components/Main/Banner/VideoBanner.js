import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

export default function VideoBanner(props) {
  const videoRef = React.useRef(null);

  return (
    <View style={[styles.container, props?.style]}>
      <Video
        ref={videoRef}
        source={props?.source}
        style={styles.video}
        resizeMode="cover"
        repeat={true}
        muted={true}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        onLoad={() => {
          // Video is ready to play
        }}
        onError={(error) => {
          console.log('Video error:', error);
        }}
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
  }
});