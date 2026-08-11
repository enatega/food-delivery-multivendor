/* eslint-disable @typescript-eslint/no-require-imports */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  const playSound = useCallback(async () => {
    try {
      const player = soundRef.current;
      if (!player) return;
      await player.seekTo(0);
      player.play();
    } catch {
      // no-op: keep the app usable if audio startup fails.
    }
  }, []);

  const stopSound = useCallback(async () => {
    if (soundRef.current) {
      const player = soundRef.current;
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
    }
  }, []);

  const silenceRing = useCallback(async () => {
    silencedRef.current = true;
    silencedOrderIdsRef.current = ringedOrderIds;
    await stopSound();
  }, [ringedOrderIds, stopSound]);

  useEffect(() => {
    const player = createAudioPlayer(require("@/lib/assets/sound/beep3.mp3"));
    player.loop = true;
    soundRef.current = player;
    void setAudioModeAsync({
      allowsRecording: false,
      shouldPlayInBackground: true,
      interruptionMode: "duckOthers",
      playsInSilentMode: true,
      shouldRouteThroughEarpiece: true,
    }).catch(() => {});

    return () => {
      soundRef.current = null;
      player.remove();
    };
  }, []);

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
      } else {
        silencedRef.current = false;
        silencedOrderIdsRef.current = "";
        playSound();
      }
    }

    return () => {
      stopSound();
    };
  }, [hasNewOrders, playSound, ringedOrderIds, stopSound]);

  const value = useMemo(
    () => ({ playSound, stopSound, silenceRing }),
    [playSound, silenceRing, stopSound],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
};
export const SoundContextConsumer = SoundContext.Consumer;
export const useSoundContext = () => useContext(SoundContext);
export default SoundContext;
