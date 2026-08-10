const APP_MODES = {
  MULTI: 'MULTI',
  SINGLE: 'SINGLE'
}

const MULTI_ENV_CONFIG = {
  development: {
    // GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
    // WS_GRAPHQL_URL: 'wss://aws-server-v2.enatega.com/graphql',
    // SERVER_URL: 'https://aws-server-v2.enatega.com/graphql',
    // SERVER_REST_URL: 'https://aws-server-v2.enatega.com/',
    GRAPHQL_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    WS_GRAPHQL_URL: 'wss://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    SERVER_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    SERVER_REST_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/',
    // GRAPHQL_URL: 'http://192.168.1.175:8001/graphql',
    // WS_GRAPHQL_URL: 'wss://192.168.1.175:8001/graphql',
    // SERVER_URL: 'http://192.168.1.175:8001/graphql',
    // SERVER_REST_URL: 'http://192.168.1.175:8001/',
    CLARITY_ENABLED: true
  },
  staging: {
    GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
    WS_GRAPHQL_URL: 'wss://aws-server-v2.enatega.com/graphql',
    SERVER_URL: 'https://aws-server-v2.enatega.com/graphql',
    SERVER_REST_URL: 'https://aws-server-v2.enatega.com/',
    // GRAPHQL_URL: 'http://192.168.1.175:8001/graphql',
    // WS_GRAPHQL_URL: 'wss://192.168.1.175:8001/graphql',
    // SERVER_URL: 'http://192.168.1.175:8001/graphql',
    // SERVER_REST_URL: 'http://192.168.1.175:8001/',
    CLARITY_ENABLED: true
  },
  production: {
    GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
    WS_GRAPHQL_URL: 'wss://aws-server-v2.enatega.com/graphql',
    SERVER_URL: 'https://aws-server-v2.enatega.com/graphql',
    SERVER_REST_URL: 'https://aws-server-v2.enatega.com/',
    // GRAPHQL_URL: 'http://192.168.1.175:8001/graphql',
    // WS_GRAPHQL_URL: 'wss://192.168.1.175:8001/graphql',
    // SERVER_URL: 'http://192.168.1.175:8001/graphql',
    // SERVER_REST_URL: 'http://192.168.1.175:8001/',
    CLARITY_ENABLED: true
  }
}

// Single-vendor production backend. Environment variables can still override
// it for local or staging builds when needed.
const SINGLE_VENDOR_DEFAULT_HOST =
  'enatega-multivendor-api-production-9b09.up.railway.app'

const getSingleVendorConfig = () => {
  const graphqlUrl = process.env.EXPO_PUBLIC_SINGLE_VENDOR_GRAPHQL_URL
  const wsGraphqlUrl = process.env.EXPO_PUBLIC_SINGLE_VENDOR_WS_GRAPHQL_URL
  const serverRestUrl = process.env.EXPO_PUBLIC_SINGLE_VENDOR_REST_URL
  const explicitlyEnabled =
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_ENABLED === 'true'

  if (graphqlUrl && wsGraphqlUrl && serverRestUrl) {
    return {
      GRAPHQL_URL: graphqlUrl,
      WS_GRAPHQL_URL: wsGraphqlUrl,
      SERVER_URL: graphqlUrl,
      SERVER_REST_URL: serverRestUrl,
      CLARITY_ENABLED: false,
      PUBLIC_ACCESS_REQUIRED: true,
      SINGLE_VENDOR_ENABLED: explicitlyEnabled
    }
  }

  return {
    GRAPHQL_URL: `https://${SINGLE_VENDOR_DEFAULT_HOST}/graphql`,
    WS_GRAPHQL_URL: `wss://${SINGLE_VENDOR_DEFAULT_HOST}/graphql`,
    SERVER_URL: `https://${SINGLE_VENDOR_DEFAULT_HOST}/graphql`,
    SERVER_REST_URL: `https://${SINGLE_VENDOR_DEFAULT_HOST}/`,
    CLARITY_ENABLED: false,
    PUBLIC_ACCESS_REQUIRED: true,
    SINGLE_VENDOR_ENABLED:
      process.env.EXPO_PUBLIC_SINGLE_VENDOR_ENABLED !== 'false'
  }
}

const normalizeEnvironment = (env) => {
  if (env === 'production' || env === 'staging') return env
  return 'development'
}

const getEnvironmentConfig = (env, mode = APP_MODES.MULTI) => {
  const environment = normalizeEnvironment(env)

  if (mode === APP_MODES.SINGLE) {
    return getSingleVendorConfig()
  }

  return {
    ...MULTI_ENV_CONFIG[environment],
    PUBLIC_ACCESS_REQUIRED: true,
    SINGLE_VENDOR_ENABLED: getSingleVendorConfig().SINGLE_VENDOR_ENABLED
  }
}

module.exports = {
  ENV_CONFIG: MULTI_ENV_CONFIG,
  MULTI_ENV_CONFIG,
  getEnvironmentConfig,
  normalizeEnvironment
}
