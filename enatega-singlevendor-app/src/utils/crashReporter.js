import * as Sentry from '@sentry/react-native'

// QUAL-011: Centralised, defensive crash-reporting wrapper.
//
// All calls are guarded so the app never crashes because of the reporter:
//  - init is a no-op without a DSN (DSN comes from server config — see
//    environment.js / SEC-010), or if the native module isn't present yet
//    (e.g. an un-rebuilt binary).
//  - captureException is a no-op until init has succeeded.

let initialized = false

export const initCrashReporter = (dsn) => {
  if (initialized || !dsn) return
  try {
    Sentry.init({
      dsn,
      // Don't attach IP / cookies etc. by default.
      sendDefaultPii: false,
      // Keep tracing off unless explicitly configured; crash capture only.
      tracesSampleRate: 0
    })
    initialized = true
  } catch (error) {
    if (__DEV__) console.warn('[crashReporter] init failed', error)
  }
}

export const captureException = (error, context) => {
  if (!initialized) return
  try {
    Sentry.captureException(error, context ? { extra: context } : undefined)
  } catch (e) {
    if (__DEV__) console.warn('[crashReporter] capture failed', e)
  }
}

export const isCrashReporterEnabled = () => initialized
