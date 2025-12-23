// Dynamic Expo configuration
// This file allows us to use environment variables for sensitive tokens
// instead of hardcoding them in app.json

const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: IS_DEV ? 'Kourt (Dev)' : 'Kourt',
    slug: 'kourt-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    scheme: 'kourt',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: IS_DEV ? 'com.bruno.kourt.app.dev' : 'com.bruno.kourt.app',
      buildNumber: '1',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Kourt usa sua localização para mostrar quadras próximas a você.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'Kourt usa sua localização para mostrar quadras próximas a você.',
        NSCameraUsageDescription:
          'Kourt usa a câmera para adicionar fotos de partidas e perfil.',
        NSPhotoLibraryUsageDescription:
          'Kourt acessa suas fotos para compartilhar momentos e atualizar seu perfil.',
        NSPhotoLibraryAddUsageDescription: 'Kourt salva fotos de suas partidas.',
        // Mapbox token from environment variable
        MBXAccessToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN,
        NSAnalyticsCollectionEnabled: true,
        ITSAppUsesNonExemptEncryption: false,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              'com.googleusercontent.apps.138959893910-6910pim9b6v1r6dsism9suthh65u5p2o',
            ],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#000000',
      },
      package: IS_DEV ? 'com.kourt.app.dev' : 'com.kourt.app',
      versionCode: 1,
      permissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.VIBRATE',
        'android.permission.RECEIVE_BOOT_COMPLETED',
        'android.permission.RECORD_AUDIO',
      ],
    },
    plugins: [
      'expo-router',
      'expo-apple-authentication',
      '@react-native-google-signin/google-signin',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location.',
        },
      ],
      [
        '@rnmapbox/maps',
        {
          // Mapbox download token from environment variable
          RNMapboxMapsDownloadToken: process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN,
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            newArchEnabled: false,
            bitcode: false,
          },
        },
      ],
    ],
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      mapboxToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN,
      stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      router: {},
      eas: {
        projectId: '5200bae0-6cdd-4f10-938d-622c43b410e1',
      },
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    experiments: {
      typedRoutes: true,
    },
    owner: 'bruno.camargo0498',
  },
};
