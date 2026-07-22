import { config as loadDotenv } from 'dotenv'

import {
  type QaEnvironment,
  validateQaEnvironment
} from './qa-environment.js'

export function loadQaEnvironment(path = '.env.local'): QaEnvironment {
  const processEnv: Record<string, string> = {}
  const result = loadDotenv({ path, processEnv, quiet: true })

  if (result.error) {
    throw new Error(`Unable to load QA environment file: ${path}`)
  }

  return validateQaEnvironment(processEnv)
}
