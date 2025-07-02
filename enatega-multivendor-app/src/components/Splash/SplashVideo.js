import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function SplashVideo({ onLoaded, onFinish }) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const player = useVideoPlayer(require('./../../../assets/mobileSplash.mp4'), (player) => {
    player.loop = false;
    player.muted = true;
  });

  useEffect(() => {
    // Delay initial play to ensure video is ready after cache clear
    const playTimeout = setTimeout(() => {
      player.play();
    }, 500);

    const statusSubscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay' && !hasLoaded) {
        setHasLoaded(true);
        onLoaded?.();
        // Ensure play after ready state
        player.play();
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