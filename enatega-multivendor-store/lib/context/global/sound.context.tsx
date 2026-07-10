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
  const silencedOrderIdsRef = useRef("");
  // Context/Hooks
  const { hasNewOrders, ringedOrderIds } = useOrders();

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
      // no-op: keep the app usable if audio startup fails.
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      const player = soundRef.current;
      soundRef.current = null;
      try {
        player.pause();
      } catch {
        // no-op: player may already be disposed.
      }
      try {
        await player.seekTo(0);
      } catch {
        // no-op: player may already be disposed.
      }
      try {
        await player.stop();
      } catch {
        // no-op: player may already be disposed.
      }
      try {
        player.remove();
      } catch {
        // no-op: player may already be disposed.
      }
    }
  };

  const silenceRing = async () => {
    silencedRef.current = true;
    silencedOrderIdsRef.current = ringedOrderIds;
    await stopSound();
  };

  useEffect(() => {
    if (!hasNewOrders) {
      silencedRef.current = false;
      silencedOrderIdsRef.current = "";
      stopSound();
      return () => {
        stopSound();
      };
    }

    if (hasNewOrders) {
      if (
        silencedRef.current &&
        silencedOrderIdsRef.current === ringedOrderIds
      ) {
        stopSound();
      } else if (!soundRef.current) {
        silencedRef.current = false;
        silencedOrderIdsRef.current = "";
        playSound();
      }
    }

    return () => {
      stopSound();
    };
  }, [hasNewOrders, ringedOrderIds]);

  return (
    <SoundContext.Provider value={{ playSound, stopSound, silenceRing }}>
      {children}
    </SoundContext.Provider>
  );
};
export const SoundContextConsumer = SoundContext.Consumer;
export const useSoundContext = () => useContext(SoundContext);
export default SoundContext;
