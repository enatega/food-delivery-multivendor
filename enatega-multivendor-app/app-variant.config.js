const NORMAL_IDENTITY = {
  name: 'Enatega Multi',
  bundleIdentifier: 'com.enatega.multivendor',
  packageName: 'com.enatega.multivendor',
  scheme: 'enategamultivendor'
}

const QA_PRODUCTION_IDENTITY = {
  name: 'Enatega QA • PROD',
  bundleIdentifier: 'com.enatega.multivendor.qa',
  packageName: 'com.enatega.multivendor.qa',
  scheme: 'enategamultivendorqa'
}

const getAppVariantConfig = (environment) => {
  if (!environment) throw new Error('EXPO_PUBLIC_APP_ENV is required')
  if (environment === 'qa-production') return QA_PRODUCTION_IDENTITY
  if (['development', 'staging', 'production'].includes(environment)) {
    return NORMAL_IDENTITY
  }
  throw new Error(`Unsupported mobile app variant: ${environment}`)
}

module.exports = { getAppVariantConfig }

