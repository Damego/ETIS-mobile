const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: 'ЕТИС мобайл' + (IS_DEV ? ' (DEV)' : ''),
    slug: 'etis-mobile',
    version: '1.4.0',
    owner: 'damego',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    backgroundColor: '#CE2539',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#CE2539',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      versionCode: 10400004,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: IS_DEV ? 'dev.damego.etismobile' : 'com.damego.etismobile',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.damego.etismobile',
      userInterfaceStyle: 'automatic',
      allowBackup: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    platforms: ['android'],
    extra: {
      eas: {
        projectId: 'a3b11e9a-6c2e-4082-81e8-58bc2324b582',
      },
    },
    plugins: [
      'expo-asset',
      'expo-secure-store',
      [
        '@sentry/react-native/expo',
        {
          project: 'etis-mobile',
          organization: 'etismobile',
        },
      ],
      [
        'expo-quick-actions',
        {
          androidIcons: {
            signs: {
              foregroundImage: './assets/tab_icons/signs.png',
              backgroundColor: '#FFFFFF',
            },
            messages: {
              foregroundImage: './assets/tab_icons/messages.png',
              backgroundColor: '#FFFFFF',
            },
            announce: {
              foregroundImage: './assets/tab_icons/announce.png',
              backgroundColor: '#FFFFFF',
            },
          },
        },
      ],
      ['./src/plugins/disabledForcedDarkModeAndroid.ts', {}],
      [
        'expo-build-properties',
        {
          android: {
            // Без этого билд будет крашиться
            extraMavenRepos: ['../../node_modules/@notifee/react-native/android/libs'],
            allowBackup: false,
          },
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/Ubuntu-Regular.ttf',
            './assets/fonts/Ubuntu-Italic.ttf',
            './assets/fonts/Ubuntu-Medium.ttf',
            './assets/fonts/Ubuntu-MediumItalic.ttf',
            './assets/fonts/Ubuntu-Bold.ttf',
            './assets/fonts/Ubuntu-BoldItalic.ttf',
          ],
        },
      ],
    ],
  },
};
