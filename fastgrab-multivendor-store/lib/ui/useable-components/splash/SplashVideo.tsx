/* eslint-disable @typescript-eslint/no-require-imports */
import { ResizeMode, Video } from "expo-av";
import { StyleSheet } from "react-native";
import { useRef, useState } from "react";

export default function SplashVideo({ onLoaded, onFinish }) {
  const video = useRef(null);
  const [lastStatus, setStatus] = useState({});

  return (
    <Video
      ref={video}
      style={StyleSheet.absoluteFill}
      source={require("@/lib/assets/video/mobile-splash.mp4")}
      shouldPlay={!(lastStatus.isLoaded && lastStatus.didJustFinish)}
      isLooping={false}
      resizeMode={ResizeMode.COVER}
      onPlaybackStatusUpdate={(status) => {
        if (status.isLoaded) {
          if (lastStatus.isLoaded !== status.isLoaded) {
            onLoaded();
          }
          if (status.didJustFinish) {
            onFinish();
          }
        }
        setStatus(() => status);
      }}
    />
  );
}
