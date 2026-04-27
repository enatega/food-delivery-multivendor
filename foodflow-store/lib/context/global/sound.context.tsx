/* eslint-disable @typescript-eslint/no-require-imports */
import { useContext, useEffect, useState, createContext } from "react";
import { Audio } from "expo-av";
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
  const [sound, setSound] = useState<Audio.SoundObject | null>(null);
  // Context/Hooks
  const { hasNewOrders } = useOrders();

  // Handlers
  const playSound = async () => {
    try {
      await stopSound();
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("@/lib/assets/sound/beep3.mp3"),
      );
      await newSound.setIsLoopingAsync(true);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: (Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS = 2),
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid:
          (Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS = 2),
        playThroughEarpieceAndroid: true,
      });
      await newSound.playAsync();

      setSound(newSound);
    } catch (err) {
      console.log(err);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.unloadAsync();
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
