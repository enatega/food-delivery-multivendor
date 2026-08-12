export const APP_MODES = {
  MULTI: "MULTI",
  SINGLE: "SINGLE",
} as const;

export type AppMode = (typeof APP_MODES)[keyof typeof APP_MODES];

export const DEFAULT_APP_MODE: AppMode = APP_MODES.MULTI;
export const APP_MODE_STORAGE_KEY = "@enatega/app-mode";

export const isAppMode = (value: unknown): value is AppMode =>
  value === APP_MODES.MULTI || value === APP_MODES.SINGLE;

