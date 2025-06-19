import { StyleSheet } from 'react-native'
import { useRef, useState } from 'react'
import {Video} from 'react-native-video'

export default function SplashVideo({ onLoaded, onFinish }) {
  const videoRef = useRef(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const handleLoad = () => {
    if (!hasLoaded) {
      setHasLoaded(true);
      if (onLoaded) {
        onLoaded();
      }
    }
  };

  const handleEnd = () => {
    if (!hasFinished) {
      setHasFinished(true);
      if (onFinish) {
        onFinish();
      }
    }
  };

  return (
    <Video
      ref={videoRef}
      source={require('./../../../assets/mobileSplash.mp4')}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
      repeat={false}
      muted={true}
      playInBackground={false}
      playWhenInactive={false}
      ignoreSilentSwitch="ignore"
      onLoad={handleLoad}
      onEnd={handleEnd}
      onError={(error) => {
        console.log('Splash video error:', error);
        // Fallback - call onFinish if video fails
        if (onFinish) {
          onFinish();
        }
      }}
    />
  )
}