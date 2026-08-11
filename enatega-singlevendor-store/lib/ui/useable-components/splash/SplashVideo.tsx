/* eslint-disable @typescript-eslint/no-require-imports */
import { VideoView, useVideoPlayer } from "expo-video";
import { StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

export default function SplashVideo({ onLoaded, onFinish }) {
  const didLoad = useRef(false);
  const player = useVideoPlayer(require("@/lib/assets/video/mobile-splash.mp4"), (
    videoPlayer,
  ) => {
    videoPlayer.loop = false;
    videoPlayer.play();
  });

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
