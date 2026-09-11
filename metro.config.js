const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);
config.resolver.assetExts.push('md');

// react-native-ui-datepicker делает barrel-импорт `import { isEqual } from 'lodash'`,
// Metro не умеет tree-shaking — в бандл попадает весь lodash (~550KB).
// Подменяем на отдельный модуль с той же функцией.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'lodash' && context.originModulePath.includes('react-native-ui-datepicker')) {
    return context.resolveRequest(
      { ...context, resolveRequest: undefined },
      'lodash.isequal',
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
