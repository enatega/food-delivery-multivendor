const GOOGLE_CLIENT_ID_SUFFIX = '.apps.googleusercontent.com'

const isGoogleClientId = (value) =>
  typeof value === 'string' &&
  value.trim().length > GOOGLE_CLIENT_ID_SUFFIX.length &&
  value.trim().endsWith(GOOGLE_CLIENT_ID_SUFFIX)

export const getGoogleAuthConfigurationErrors = ({
  webClientId,
  androidClientId,
  iosClientId
}) => {
  const errors = []
  if (!isGoogleClientId(webClientId)) errors.push('webClientId')
  if (!isGoogleClientId(androidClientId)) errors.push('androidClientId')
  if (!isGoogleClientId(iosClientId)) errors.push('iosClientId')
  return errors
}

export const isGoogleAuthConfigured = (config) =>
  getGoogleAuthConfigurationErrors(config).length === 0
