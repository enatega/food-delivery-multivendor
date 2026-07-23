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
    // Native splash is a plain theme background (light/dark) that matches the
    // first frame of the animated Journey splash — no flash in either theme.
    // Configured via the expo-splash-screen plugin below.
    platforms: ['ios', 'android'],
    orientation: 'portrait',
    icon: './assets/icon.png',
    assetBundlePatterns: ['**/*'],
    userInterfaceStyle: 'automatic',
    ios: {
      entitlements: {
        'com.apple.developer.networking.wifi-info': true,
        'aps-environment': 'development'
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
          // matches Theme.Pink.themeBackground — and frame 0 of the Lottie
          backgroundColor: '#FFFFFF',
          dark: {
            // matches Theme.Dark.themeBackground
            backgroundColor: '#000000'
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
      'expo-localization',
      'expo-web-browser',
      'expo-video',
      'expo-video',
      'expo-apple-authentication'
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
