const { createRunOncePlugin, withAndroidStyles, AndroidConfig } = require('@expo/config-plugins');

const disableForcedDarkMode = (styles: Record<string, unknown>) => {
  styles = AndroidConfig.Styles.assignStylesValue(styles, {
    add: true,
    parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
    name: 'android:forceDarkAllowed',
    value: 'false',
  });

  return styles;
};

const disabledForcedDarkModeAndroid = (config: Record<string, unknown>) =>
  withAndroidStyles(config, (config: Record<string, unknown>) => {
    config.modResults = disableForcedDarkMode(config.modResults as Record<string, unknown>);
    return config;
  });

module.exports = createRunOncePlugin(
  disabledForcedDarkModeAndroid,
  'disable-forced-dark-mode',
  '1.0.0'
);
