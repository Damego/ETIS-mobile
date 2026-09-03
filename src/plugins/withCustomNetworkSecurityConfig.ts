// Copy of https://github.com/pchalupa/expo-network-security-config
// Added copying certificates to raw folder

const { AndroidConfig, withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const { mkdir, copyFile, cp } = require('fs/promises');
const { join } = require('path');

/**
 * Android network security config
 *
 * @param {import('@expo/config-types').ExpoConfig} config
 * @param {{networkSecurityConfig: string, enable?: boolean}} options
 * @returns {import('@expo/config-types').ExpoConfig} config
 */
interface Options {
  enable?: boolean;
  networkSecurityConfig: string;
  certificatesFolderPath: string;
}

module.exports = function withExpoNetworkSecurityConfig(
  config: Record<string, unknown>,
  { enable, networkSecurityConfig, certificatesFolderPath }: Options
) {
  // Early return switch
  if (!enable) return config;

  const { getMainApplicationOrThrow } = AndroidConfig.Manifest;
  const { getResourceFolderAsync } = AndroidConfig.Paths;

  // Copy network_security_config.xml to android/app/src/main/res/xml
  withDangerousMod(config, [
    'android',
    async (config: { modRequest: { projectRoot: string } }) => {
      const { projectRoot } = config.modRequest;
      const resourcePath = await getResourceFolderAsync(projectRoot);

      await mkdir(join(resourcePath, '/xml'), { recursive: true });
      await copyFile(
        join(projectRoot, networkSecurityConfig),
        join(resourcePath, '/xml/network_security_config.xml'),
      );

      // Copy certificates to android/app/src/main/res/raw
      await mkdir(join(resourcePath, '/raw'), { recursive: true });
      await cp(
        join(projectRoot, certificatesFolderPath),
        join(resourcePath, '/raw'),
        { recursive: true }
      );

      return config;
    },
  ]);

  // Add networkSecurityConfig to AndroidManifest.xml
  withAndroidManifest(config, (config: { modResults: Record<string, unknown> }) => {
    const mainApplication = getMainApplicationOrThrow(config.modResults);

    mainApplication.$['android:networkSecurityConfig'] = '@xml/network_security_config';

    return config;
  });

  return config;
};
