export const APP_MODES = Object.freeze({
  MULTI: 'MULTI',
  SINGLE: 'SINGLE'
})

export const DEFAULT_APP_MODE = APP_MODES.MULTI
export const APP_MODE_STORAGE_KEY = '@enatega/app-mode'

export const isAppMode = value =>
  value === APP_MODES.MULTI || value === APP_MODES.SINGLE
