const ENV_CONFIG = {
  development: {
    GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
    WS_GRAPHQL_URL: 'wss://aws-server-v2.enatega.com/graphql',
    SERVER_URL: 'https://aws-server-v2.enatega.com/graphql',
     SERVER_REST_URL: 'https://aws-server-v2.enatega.com/',
    // GRAPHQL_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // WS_GRAPHQL_URL: 'wss://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // SERVER_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // SERVER_REST_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/',
    CLARITY_ENABLED: false
  },
  staging: {
    GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
    WS_GRAPHQL_URL: 'wss://aws-server-v2.enatega.com/graphql',
    SERVER_URL: 'https://aws-server-v2.enatega.com/graphql',
    SERVER_REST_URL: 'https://aws-server-v2.enatega.com/',
    // GRAPHQL_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // WS_GRAPHQL_URL: 'wss://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // SERVER_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // SERVER_REST_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/',
    CLARITY_ENABLED: false
  },
  production: {
    GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
    WS_GRAPHQL_URL: 'wss://aws-server-v2.enatega.com/graphql',
    SERVER_URL: 'https://aws-server-v2.enatega.com/graphql',
    SERVER_REST_URL: 'https://aws-server-v2.enatega.com/',
    // GRAPHQL_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // WS_GRAPHQL_URL: 'wss://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // SERVER_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/graphql',
    // SERVER_REST_URL: 'https://3086ptqf-8001.inc1.devtunnels.ms/',
    CLARITY_ENABLED: false
  }
}

const normalizeEnvironment = (env) => {
  if (env === 'production' || env === 'staging') return env
  return 'development'
}

const getEnvironmentConfig = (env) => {
  return ENV_CONFIG[normalizeEnvironment(env)]
}

module.exports = {
  ENV_CONFIG,
  getEnvironmentConfig,
  normalizeEnvironment
}
