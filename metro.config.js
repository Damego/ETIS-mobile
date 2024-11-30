const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);
config.resolver.assetExts.push('md');

// https://github.com/expo/expo/discussions/21736
// Некоторые нативные модули не работают в вебе,
// но при попытке сделать билд веб-версии выходит ошибка,
// связанная как раз таки с неподдерживаемыми модулями, так как metro не создаёт модульный файл
const webBlacklistedModules = ['sp-react-native-in-app-updates'];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && webBlacklistedModules.includes(moduleName)) {
    return {
      type: 'empty',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
