export const APP_MODES = Object.freeze({
  MULTI: 'MULTI',
  SINGLE: 'SINGLE'
})

export const DEFAULT_APP_MODE = APP_MODES.MULTI
export const APP_MODE_STORAGE_KEY = '@enatega/app-mode'

export const VENDOR_MODE_POLICIES = Object.freeze({
  TOGGLE: 'TOGGLE',
  MULTI: APP_MODES.MULTI,
  SINGLE: APP_MODES.SINGLE
})

export const getVendorModePolicy = () => {
  const policy = process.env.EXPO_PUBLIC_VENDOR_MODE?.toUpperCase()
  return Object.values(VENDOR_MODE_POLICIES).includes(policy)
    ? policy
    : VENDOR_MODE_POLICIES.TOGGLE
}

export const getForcedAppMode = () => {
  const policy = getVendorModePolicy()
  return policy === VENDOR_MODE_POLICIES.TOGGLE ? null : policy
}

export const isAppMode = value =>
  value === APP_MODES.MULTI || value === APP_MODES.SINGLE
