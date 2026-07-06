/* eslint-disable @typescript-eslint/no-require-imports */
import { useContext, useEffect, useState, createContext } from "react";
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
  // State
  const [sound, setSound] = useState<ReturnType<typeof createAudioPlayer> | null>(
    null,
  );
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

      setSound(newSound);
    } catch {
      // Ignore audio startup failures and keep the app usable.
    }
  };

  const stopSound = async () => {
    if (sound) {
      sound.remove();
      setSound(null);
    }
  };

  // Use Effect
  useEffect(() => {
    if (hasNewOrders) {
      const shouldPlaySound = hasNewOrders;

      if (shouldPlaySound && !sound) {
        playSound();
      } else if (!shouldPlaySound && sound) {
        stopSound();
      }
    } else {
      stopSound();
    }

    return () => {
      if (sound) {
        stopSound();
      }
    };
  }, [hasNewOrders, sound]);

  return (
    <SoundContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
};
export const SoundContextConsumer = SoundContext.Consumer;
export const useSoundContext = () => useContext(SoundContext);
export default SoundContext;
