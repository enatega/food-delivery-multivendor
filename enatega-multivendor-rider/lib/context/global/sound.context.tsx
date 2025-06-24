/* eslint-disable @typescript-eslint/no-require-imports */
import { useContext, useEffect, useState, createContext } from "react";
import { AudioPlayer, useAudioPlayer, AudioSource } from "expo-audio";
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
  const [audioPlayer, setAudioPlayer] = useState<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Context/Hooks
  const { assignedOrders } = useUserContext();

  // Create audio player
  const player = useAudioPlayer(require("@/lib/assets/sound/beep3.mp3") as AudioSource);

  // Handlers
  const playSound = async () => {
    try {
      await stopSound();
      
      // Configure audio session (iOS/Android settings)
      // Note: expo-audio handles most audio session configuration automatically
      
      player.loop = true;
      player.play();
      setAudioPlayer(player);
      setIsPlaying(true);
    } catch (err) {
      console.log("Error playing sound:", err);
    }
  };

  const stopSound = async () => {
    if (audioPlayer && isPlaying) {
      try {
        audioPlayer.pause();
        setIsPlaying(false);
      } catch (err) {
        console.log("Error stopping sound:", err);
      }
    }
  };

  // Audio player event listeners
  useEffect(() => {
    const playingSubscription = player.addListener('playingChange', (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      playingSubscription?.remove();
    };
  }, [player]);

  // Use Effect
  useEffect(() => {
    if (assignedOrders) {
      // Check if any order should play sound
      const new_order = assignedOrders?.find(
        (o: IOrder) => o.orderStatus === "ACCEPTED" && !o?.isPickedUp,
      );

      const shouldPlaySound = !!new_order;

      if (shouldPlaySound && !isPlaying) {
        playSound();
      } else if (!shouldPlaySound && isPlaying) {
        stopSound();
      }
    } else {
      stopSound();
    }

    return () => {
      if (isPlaying) {
        stopSound();
      }
    };
  }, [assignedOrders, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isPlaying) {
        player.pause();
      }
    };
  }, []);

  return (
    <SoundContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const SoundContextConsumer = SoundContext.Consumer;
export const useSoundContext = () => useContext(SoundContext);
export default SoundContext;