import { StyleSheet, View } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { VideoView, useVideoPlayer, VideoPlayer } from 'expo-video';

interface SplashVideoProps {
  onLoaded?: () => void;
  onFinish?: () => void;
}

export default function SplashVideo({ onLoaded, onFinish }: SplashVideoProps) {
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const playerRef = useRef<VideoPlayer | null>(null);

  // Create video player instance
  const player = useVideoPlayer(require("@/lib/assets/video/mobile-splash.mp4"), (player) => {
    playerRef.current = player;
    player.loop = false;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener('statusChange', (status) => {
      console.log('Video status:', status); // Debug log
      
      if (status.isLoaded && !hasLoaded) {
        setHasLoaded(true);
        onLoaded?.();
      }
    });

    // Try multiple possible event names for video end
    const endSubscription1 = player.addListener('playToEnd', () => {
      console.log('Video ended (playToEnd)'); // Debug log
      if (!hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    const endSubscription2 = player.addListener('playbackEnd', () => {
      console.log('Video ended (playbackEnd)'); // Debug log
      if (!hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    const endSubscription3 = player.addListener('didJustFinish', () => {
      console.log('Video ended (didJustFinish)'); // Debug log
      if (!hasFinished) {
        setHasFinished(true);
        onFinish?.();
      }
    });

    // Also try checking status changes for completion
    const statusSubscription = player.addListener('statusChange', (status) => {
      if (status.status === 'readyToPlay' && !hasLoaded) {
        setHasLoaded(true);
        onLoaded?.();
      }
      
      // Check if video has finished playing
      if ((status.status === 'idle' || status.didJustFinish) && hasLoaded && !hasFinished) {
        console.log('Video ended via status change'); // Debug log
        setHasFinished(true);
        onFinish?.();
      }
    });

    return () => {
      subscription?.remove();
      endSubscription1?.remove();
      endSubscription2?.remove();
      endSubscription3?.remove();
      statusSubscription?.remove();
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