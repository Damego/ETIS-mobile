const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  expo: {
    name: 'ЕТИС мобайл' + (IS_DEV ? ' (DEV)' : ''),
    slug: 'etis-mobile',
    version: '1.2.5',
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
      versionCode: 10205000,
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
    hooks: {
      postPublish: [
        {
          file: 'sentry-expo/upload-sourcemaps',
          config: {
            organization: 'etismobile',
            project: 'etis-mobile',
          },
        },
      ],
    },
    plugins: [
      ['./src/plugins/copyDrawable.ts', './assets/tab_icons'],
      ['./src/plugins/disabledForcedDarkModeAndroid.ts', {}],
      '@config-plugins/react-native-quick-actions',
      'sentry-expo',
    ],
  },
};
