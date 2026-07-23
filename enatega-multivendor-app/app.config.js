module.exports = () => {
  const iosGoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS
  const androidGoogleMapsApiKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID
  const reversedGoogleIosClientId =
    process.env.EXPO_PUBLIC_GOOGLE_IOS_REVERSED_CLIENT_ID

  const fallbackUrlTypes = [
    {
      CFBundleURLSchemes: [
        'com.googleusercontent.apps.650001300965-dkji7jutv8gc5m4n7cdg3nft87sauhn7'
      ]
    }
  ]

  const urlTypes = reversedGoogleIosClientId
    ? [
        {
          CFBundleURLSchemes: [reversedGoogleIosClientId]
        }
      ]
    : fallbackUrlTypes

  return {
    name: 'Enatega Multi',
    scheme: 'enategamultivendor',
    version: '1.1.27',
    description:
      "Enatega is a starter kit food ordering app built in React Native using Expo for IOS and Android. It's made keeping good aesthetics in mind as well keeping the best coding practices in mind. Its fully customisable to easily help you in your next food delivery project. https://market.nativebase.io/view/react-native-food-delivery-backend-app",
    slug: 'enategamultivendor',
    owner: 'ninjas_code',
    experiments: {
      buildCacheProvider: 'eas'
    },
    androidStatusBar: {
      backgroundColor: '#000000'
    },
    // Native OS splash (before JS boots) is theme-aware via the
    // expo-splash-screen plugin below — a solid per-theme background that
    // matches AnimatedSplash's first frame, so there is no black/white flash.
    platforms: ['ios', 'android'],
    orientation: 'portrait',
    icon: './assets/icon.png',
    assetBundlePatterns: ['**/*'],
    userInterfaceStyle: 'automatic',
    ios: {
      entitlements: {
        'com.apple.developer.networking.wifi-info': true,
        // Use the production APNs gateway for production builds so push
        // notifications are not silently rejected on App Store devices (SEC-013).
        'aps-environment':
          process.env.APP_ENV === 'production' ? 'production' : 'development'
      },
      supportsTablet: true,
      userInterfaceStyle: 'automatic',
      bundleIdentifier: 'com.enatega.multivendor',
      icon: './assets/icon.png',
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Allow $(PRODUCT_NAME) to use location to determine the delivery address for your orders.',
        UIBackgroundModes: ['remote-notification', 'remote-notification'],
        NSUserTrackingUsageDescription:
          'Allow this app to collect app-related data that can be used for tracking you or your device.',
        CFBundleURLTypes: urlTypes,
        ITSAppUsesNonExemptEncryption: false
      },
      config: {
        ...(iosGoogleMapsApiKey ? { googleMapsApiKey: iosGoogleMapsApiKey } : {})
      },
      usesAppleSignIn: true
    },
    notification: {
      iosDisplayInForeground: true,
      color: '#90E36D',
      icon: './assets/not-icon.png',
      androidMode: 'default',
      androidCollapsedTitle: 'Enatega Multivendor'
    },
    android: {
      versionCode: 127,
      package: 'com.enatega.multivendor',
      userInterfaceStyle: 'automatic',
      // Disable ADB/cloud backups so the AsyncStorage DB (JWT) can't be pulled
      // off a connected device without root (SEC-002).
      allowBackup: false,
      googleServicesFile: './google-services.json',
      config: {
        ...(androidGoogleMapsApiKey
          ? {
              googleMaps: {
                apiKey: androidGoogleMapsApiKey
              }
            }
          : {})
      },
      permissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.FOREGROUND_SERVICE'
      ],
      // Strip dangerous permissions that no feature uses and that library
      // transitive manifests can pull in (tapjacking / broad storage) (SEC-006).
      blockedPermissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.SYSTEM_ALERT_WINDOW',
        'android.permission.WRITE_EXTERNAL_STORAGE'
      ],
      icon: './assets/appIcon.png',
      queries: {
        packages: ['com.whatsapp', 'com.whatsapp.w4b']
      },
      intentFilters: [
        {
          action: 'android.intent.action.VIEW',
          data: [
            {
              scheme: 'whatsapp'
            }
          ],
          category: ['BROWSABLE', 'DEFAULT']
        }
      ],
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#000000'
      }
    },
    plugins: [
      [
        'expo-splash-screen',
        {
          // Solid per-theme background, no logo image. The animated pin /
          // wordmark is drawn by the JS AnimatedSplash component, whose first
          // frame uses these same colors so the handoff shows no flash.
          backgroundColor: '#f4f8f5', // light ("Pink")
          resizeMode: 'cover',
          dark: {
            backgroundColor: '#0b1225' // dark
          }
        }
      ],
      [
        'expo-tracking-transparency',
        {
          userTrackingPermission:
            'Allow this app to collect app-related data that can be used for tracking you or your device.'
        }
      ],
      [
        'expo-updates',
        {
          username: 'ninjas_code'
        }
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow $Enatega Multivendor to use your location.'
        }
      ],
      'expo-notifications',
      'expo-font',
      'expo-secure-store',
      'expo-localization',
      'expo-web-browser',
      'expo-video',
      'expo-apple-authentication',
      // Xcode 26 / clang fmt consteval build fix (see plugins/withFmtConstevalFix.js)
      './plugins/withFmtConstevalFix'
    ],
    extra: {
      eas: {
        projectId: '331d4e5b-b12a-434a-92ec-d6d283dc0e46'
      }
    },
    runtimeVersion: {
      policy: 'sdkVersion'
    },
    updates: {
      url: 'https://u.expo.dev/331d4e5b-b12a-434a-92ec-d6d283dc0e46'
    }
  }
}
