import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

export default function SplashVideo({ onLoaded, onFinish }) {
  const didLoad = useRef(false);
  const player = useVideoPlayer(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("../../assets/video/mobile-splash.mp4"),
    (videoPlayer) => {
      videoPlayer.loop = false;
      videoPlayer.play();
    },
  );

  useEffect(() => {
    const subscription = player.addListener("playToEnd", onFinish);
    return () => subscription.remove();
  }, [onFinish, player]);

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      nativeControls={false}
      contentFit="cover"
      onFirstFrameRender={() => {
        if (didLoad.current) {
          return;
        }
        didLoad.current = true;
        onLoaded();
      }}
    />
  );
}
