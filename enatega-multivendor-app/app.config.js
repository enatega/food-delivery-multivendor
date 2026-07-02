const appJson = require('./app.json')
const { getEnvironmentConfig } = require('./environment.config')

module.exports = () => {
  const config = appJson.expo
  const appEnvironment =
    process.env.APP_ENV ||
    process.env.EAS_BUILD_PROFILE ||
    process.env.EXPO_PUBLIC_APP_ENV ||
    'development'
  const sharedConfig = getEnvironmentConfig(appEnvironment)
  const googleMapsApiKey = sharedConfig.GOOGLE_MAPS_API_KEY

  return {
    ...config,
    ios: {
      ...config.ios,
      config: {
        ...config.ios.config,
        ...(googleMapsApiKey ? { googleMapsApiKey } : {})
      }
    },
    android: {
      ...config.android,
      config: {
        ...config.android.config,
        ...(googleMapsApiKey
          ? {
              googleMaps: {
                apiKey: googleMapsApiKey
              }
            }
          : {})
      }
    },
    extra: {
      ...config.extra,
      appEnvironment
    }
  }
}
