const iosGoogleMapsApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS ||
  process.env.IOS_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY
const androidGoogleMapsApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID ||
  process.env.ANDROID_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY

module.exports = {
  expo: {
    name: 'JSML Rider',
    description:
      'JSML multivendor rider delivery app.',
    version: '1.1.95',
    slug: 'food-delivery-rider-multivendor',
    orientation: 'portrait',
    icon: './lib/assets/images/icon.png',
    assetBundlePatterns: ['lib/assets/**/*'],
    scheme: 'com.enatega.multirider',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    plugins: [
      'expo-router',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'JSML Rider uses your precise location during active deliveries so customers and dispatchers can follow delivery progress even when the app is not in use.',
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true
        }
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#ffffff',
          image: './lib/assets/images/splash-image.png',
          imageWidth: 360,
          resizeMode: 'contain',
          dark: {
            backgroundColor: '#ffffff',
            image: './lib/assets/images/splash-image.png'
          }
        }
      ],
      [
        'expo-build-properties',
        {
          android: {
            // Google Play requires new releases to target Android 16 (API 36).
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            buildToolsVersion: '36.0.0'
          }
        }
      ],
      [
        '@sentry/react-native/expo',
        {
          organization: 'ninjas-code',
          project: 'enatega-rider-app',
          url: 'https://sentry.io/'
        }
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos for license, vehicle plate and profile image. Please allow these to continue using the app.'
        }
      ],
      'expo-font',
      'expo-secure-store'
    ],
    platforms: ['ios', 'android'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.enatega.multirider',
      config: {
        ...(iosGoogleMapsApiKey ? { googleMapsApiKey: iosGoogleMapsApiKey } : {})
      },
      icon: './lib/assets/images/icon.png',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          '$(PRODUCT_NAME) uses your precise location while you use the app to support pickup and delivery navigation.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          '$(PRODUCT_NAME) shares your precise location during active deliveries so customers and dispatchers can follow delivery progress even when the app is not in use.',
        UIBackgroundModes: ['location', 'fetch', 'remote-notification'],
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      versionCode: 96,
      googleServicesFile: './google-services.json',
      config: {
        googleMaps: {
          ...(androidGoogleMapsApiKey ? { apiKey: androidGoogleMapsApiKey } : {})
        }
      },
      package: 'com.enatega.multirider',
      icon: './lib/assets/images/adaptive-icon.png',
      adaptiveIcon: {
        foregroundImage: './lib/assets/images/appIcon.png',
        backgroundColor: '#ffffff'
      }
    },
    extra: {
      eas: {
        projectId: '9144a7fc-b205-464a-8fb6-64eb66fc8743'
      }
    },
    experiments: {
      typedRoutes: true
    }
  }
}
