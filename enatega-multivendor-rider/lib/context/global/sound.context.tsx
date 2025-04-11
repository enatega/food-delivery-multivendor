/* eslint-disable @typescript-eslint/no-require-imports */
import { useContext, useEffect, useState, createContext } from "react";
import { Audio } from "expo-av";
// Interface
import {
  ISoundContext,
  ISoundContextProviderProps,
} from "@/lib/utils/interfaces";
// Context/Hooks
import { useUserContext } from "./user.context";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

const SoundContext = createContext<ISoundContext>({} as ISoundContext);

export const SoundProvider = ({ children }: ISoundContextProviderProps) => {
  // State
  const [sound, setSound] = useState<Audio.SoundObject | null>(null);
  // Context/Hooks
  const { assignedOrders } = useUserContext();

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
      await sound?.unloadAsync();
      setSound(null);
    }
  };

  // Use Effect
  useEffect(() => {
    if (assignedOrders) {
      // Check if any order should play sound
      const new_order = assignedOrders?.find(
        (o: IOrder) => o.orderStatus === "ACCEPTED" && !o?.isPickedUp,
      );

      const shouldPlaySound = !!new_order;

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
  }, [assignedOrders, sound]);

  return (
    <SoundContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
};
export const SoundContextConsumer = SoundContext.Consumer;
export const useSoundContext = () => useContext(SoundContext);
export default SoundContext;
