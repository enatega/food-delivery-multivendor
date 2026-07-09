/* eslint-disable @typescript-eslint/no-require-imports */
import { useContext, useEffect, useRef, createContext } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
// Interface
import {
  ISoundContext,
  ISoundContextProviderProps,
} from "@/lib/utils/interfaces";
// Context/Hooks

// Hook
import useOrders from "@/lib/hooks/useOrders";

const SoundContext = createContext<ISoundContext>({} as ISoundContext);

export const SoundProvider = ({ children }: ISoundContextProviderProps) => {
  const soundRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null);
  const silencedRef = useRef(false);
  // Context/Hooks
  const { hasNewOrders } = useOrders();

  // Handlers
  const playSound = async () => {
    try {
      await stopSound();
      const newSound = createAudioPlayer(
        require("@/lib/assets/sound/beep3.mp3"),
      );
      newSound.loop = true;
      await setAudioModeAsync({
        allowsRecording: false,
        shouldPlayInBackground: true,
        interruptionMode: "duckOthers",
        playsInSilentMode: true,
        shouldRouteThroughEarpiece: true,
      });
      newSound.play();

      soundRef.current = newSound;
    } catch {
      // Ignore audio startup failures and keep the app usable.
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      const player = soundRef.current;
      soundRef.current = null;
      try {
        player.pause();
      } catch {}
      try {
        await player.seekTo(0);
      } catch {}
      try {
        await player.stop();
      } catch {}
      try {
        player.remove();
      } catch {}
    }
  };

  const silenceRing = async () => {
    silencedRef.current = true;
    await stopSound();
  };

  useEffect(() => {
    if (!hasNewOrders) {
      silencedRef.current = false;
      stopSound();
      return () => {
        stopSound();
      };
    }

    if (hasNewOrders) {
      if (silencedRef.current) {
        stopSound();
      } else if (!soundRef.current) {
        playSound();
      }
    }

    return () => {
      stopSound();
    };
  }, [hasNewOrders]);

  return (
    <SoundContext.Provider value={{ playSound, stopSound, silenceRing }}>
      {children}
    </SoundContext.Provider>
  );
};
export const SoundContextConsumer = SoundContext.Consumer;
export const useSoundContext = () => useContext(SoundContext);
export default SoundContext;
