export const APP_MODES = Object.freeze({
  MULTI: 'MULTI',
  SINGLE: 'SINGLE'
})

// This release is single-vendor-first. Setting the flag explicitly to false
// restores the original combined app and its mode selector.
export const DEFAULT_SINGLE_VENDOR =
  process.env.EXPO_PUBLIC_DEFAULT_SINGLE_VENDOR !== 'false'
export const DEFAULT_APP_MODE = DEFAULT_SINGLE_VENDOR
  ? APP_MODES.SINGLE
  : APP_MODES.MULTI
export const APP_MODE_STORAGE_KEY = '@enatega/app-mode'

export const isAppMode = value =>
  value === APP_MODES.MULTI || value === APP_MODES.SINGLE
