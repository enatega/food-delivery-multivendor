export const APP_MODES = {
  MULTI: "MULTI",
  SINGLE: "SINGLE",
} as const;

export type AppMode = (typeof APP_MODES)[keyof typeof APP_MODES];

export const DEFAULT_APP_MODE: AppMode = APP_MODES.MULTI;
export const APP_MODE_STORAGE_KEY = "@enatega/app-mode";

export const getForcedAppMode = (): AppMode | null => {
  const policy = process.env.NEXT_PUBLIC_VENDOR_MODE?.toUpperCase();
  if (policy === APP_MODES.SINGLE) return APP_MODES.SINGLE;
  if (policy === APP_MODES.MULTI) return APP_MODES.MULTI;
  return null;
};

export const isAppMode = (value: unknown): value is AppMode =>
  value === APP_MODES.MULTI || value === APP_MODES.SINGLE;
