const { createRunOncePlugin, withAndroidStyles, AndroidConfig } = require('@expo/config-plugins');

const disableForcedDarkMode = (styles) => {
  styles = AndroidConfig.Styles.assignStylesValue(styles, {
    add: true,
    parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
    name: 'android:forceDarkAllowed',
    value: 'false',
  });

  return styles;
};

const disabledForcedDarkModeAndroid = (config) =>
  withAndroidStyles(config, (config) => {
    config.modResults = disableForcedDarkMode(config.modResults);
    return config;
  });

module.exports = createRunOncePlugin(
  disabledForcedDarkModeAndroid,
  'disable-forced-dark-mode',
  '1.0.0'
);
