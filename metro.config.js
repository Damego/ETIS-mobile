const path = require('node:path');

const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);
config.resolver.assetExts.push('md');

// react-native-ui-datepicker делает barrel-импорт `import { isEqual } from 'lodash'`,
// Metro не умеет tree-shaking — в бандл попадает весь lodash (~550KB).
// Подменяем на локальный шим: он реэкспортирует lodash.isequal и как named, и как
// default — напрямую на пакет резолвить нельзя (CJS module.exports = fn не даёт
// named import `isEqual`, получается undefined).
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'lodash' && context.originModulePath.includes('react-native-ui-datepicker')) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'src/shims/lodash.ts'),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
