const ENV_CONFIG = {
  development: {
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
    // GRAPHQL_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // WS_GRAPHQL_URL: 'wss://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // SERVER_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // SERVER_REST_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/',
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
  },
  'qa-production': {
    GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
    WS_GRAPHQL_URL: 'wss://aws-server-v2.enatega.com/graphql',
    SERVER_URL: 'https://aws-server-v2.enatega.com/graphql',
    SERVER_REST_URL: 'https://aws-server-v2.enatega.com/',
    CLARITY_ENABLED: false,
    IS_QA_AUTOMATION_BUILD: true
  }
}

const normalizeEnvironment = (env) => {
  if (!env) throw new Error('EXPO_PUBLIC_APP_ENV is required')
  if (Object.hasOwn(ENV_CONFIG, env)) return env
  throw new Error(`Unsupported mobile environment: ${env}`)
}

const getEnvironmentConfig = (env) => {
  return ENV_CONFIG[normalizeEnvironment(env)]
}

module.exports = {
  ENV_CONFIG,
  getEnvironmentConfig,
  normalizeEnvironment
}
