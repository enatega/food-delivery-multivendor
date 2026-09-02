import { useEffect } from 'react'
import useEnvVars from '../../../environment'
import { initCrashReporter } from '../../utils/crashReporter'

// Initializes crash reporting once the server-provided Sentry DSN is available.
// Rendered inside ConfigurationProvider so useEnvVars() can read the DSN
// (QUAL-011). Renders nothing.
export default function SentryInit() {
  const { SENTRY_DSN } = useEnvVars()

  useEffect(() => {
    if (SENTRY_DSN) initCrashReporter(SENTRY_DSN)
  }, [SENTRY_DSN])

  return null
}
