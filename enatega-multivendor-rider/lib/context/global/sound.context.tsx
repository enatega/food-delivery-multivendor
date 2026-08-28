/* eslint-disable @typescript-eslint/no-require-imports */
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  createContext,
} from "react";
import { useAudioPlayer, AudioSource } from "expo-audio";
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
  const isPlayingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Context/Hooks
  const { assignedOrders } = useUserContext();

  // Create audio player
  const player = useAudioPlayer(require("@/lib/assets/sound/beep3.mp3") as AudioSource);

  // Handlers
  const playSound = useCallback(() => {
    if (!isMountedRef.current || isPlayingRef.current) return;

    try {
      player.loop = true;
      player.play();
      isPlayingRef.current = true;
    } catch (err) {
      isPlayingRef.current = false;
      console.log("Error playing sound:", err);
    }
  }, [player]);

  const stopSound = useCallback(() => {
    if (!isMountedRef.current || !isPlayingRef.current) return;

    isPlayingRef.current = false;
    try {
      player.pause();
    } catch (err) {
      if (!String(err).includes("already released")) {
        console.log("Error stopping sound:", err);
      }
    }
  }, [player]);

  // Audio player event listeners
  useEffect(() => {
    const playingSubscription = player.addListener('playingChange', (isPlaying) => {
      isPlayingRef.current = isPlaying;
    });

    return () => {
      playingSubscription?.remove();
    };
  }, [player]);

  // Use Effect
  useEffect(() => {
    if (assignedOrders) {
      // Only beep for orders that are actually available for THIS rider to
      // grab (accepted by the restaurant, unassigned, not yet picked up) —
      // matching the "New Orders" tab filter (new-orders.tsx). Without the
      // `!o.rider` check, any order already assigned to a rider (this one or
      // another) and simply not yet picked up kept the beep looping even
      // though there was nothing left to accept.
      const new_order = assignedOrders?.find(
        (o: IOrder) =>
          o.orderStatus === "ACCEPTED" && !o?.rider && !o?.isPickedUp,
      );

      const shouldPlaySound = !!new_order;

      if (shouldPlaySound) {
        playSound();
      } else {
        stopSound();
      }
    } else {
      stopSound();
    }
  }, [assignedOrders, playSound, stopSound]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      isPlayingRef.current = false;
      try {
        player.pause();
      } catch {
        // expo-audio may release its shared object before React cleanup runs.
      }
    };
  }, [player]);

  return (
    <SoundContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const SoundContextConsumer = SoundContext.Consumer;
export const useSoundContext = () => useContext(SoundContext);
export default SoundContext;
