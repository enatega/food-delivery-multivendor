import { AppState } from 'react-native'

// SEC-015: Ephemeral, in-memory-only holder for the password-reset OTP.
//
// The OTP is NO LONGER passed through React Navigation params (which can surface
// in crash reports / React DevTools navigation-state snapshots). It lives only in
// this module-level variable, which means:
//
//  - App killed / closed  -> memory is freed, the OTP is gone (nothing persisted).
//  - New OTP generated     -> setResetSession() overwrites (previous value dropped);
//                             callers also call clearResetSession() when starting a
//                             fresh request.
//  - After it is used      -> the reset screen clears it on success and on unmount.
//  - App sent to background -> an AppState listener clears it (defense-in-depth).
//  - Stale (unused > TTL)   -> getResetSession() self-expires and returns null.
//
// Nothing here is written to AsyncStorage / SecureStore — it is intentionally
// volatile so it cannot outlive the flow.

const TTL_MS = 10 * 60 * 1000 // 10 minutes

let session = null // { email, otp, createdAt }
let appStateSubscription = null

const ensureBackgroundCleanup = () => {
  if (appStateSubscription) return
  appStateSubscription = AppState.addEventListener('change', (nextState) => {
    // Drop the OTP whenever the app leaves the foreground.
    if (nextState === 'background' || nextState === 'inactive') {
      clearResetSession()
    }
  })
}

export const setResetSession = ({ email, otp }) => {
  // Overwrite any previous value (a new OTP invalidates the old one).
  session = { email, otp, createdAt: Date.now() }
  ensureBackgroundCleanup()
}

export const getResetSession = () => {
  if (!session) return null
  if (Date.now() - session.createdAt > TTL_MS) {
    clearResetSession()
    return null
  }
  return { email: session.email, otp: session.otp }
}

export const clearResetSession = () => {
  session = null
}
