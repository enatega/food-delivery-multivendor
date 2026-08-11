/* eslint-disable @typescript-eslint/no-empty-object-type */
import { IGlobalProviderProps } from "./global.interface";

import { IGlobalProps } from "./global.interface";

export interface ISoundContext extends IGlobalProps {
  playSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  silenceRing: (durationMs?: number) => Promise<void>;
}

export interface ISoundContextProviderProps extends IGlobalProviderProps {}
