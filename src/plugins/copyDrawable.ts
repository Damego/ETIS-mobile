const { withDangerousMod } = require('@expo/config-plugins');
const { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync } = require('fs');
const { basename, join } = require('path');

const androidFolderPath = ['app', 'src', 'main', 'res', 'drawable'];

const withDrawableAssets = (expoConfig, files) =>
  withDangerousMod(expoConfig, [
    'android',
    (modConfig) => {
      if (modConfig.modRequest.platform === 'android') {
        const androidDrawablePath = join(
          modConfig.modRequest.platformProjectRoot,
          ...androidFolderPath
        );
        if (!Array.isArray(files)) {
          files = [files];
        }

        files.forEach((file) => {
          const isFile = lstatSync(file).isFile();
          if (isFile) {
            copyFileSync(file, join(androidDrawablePath, basename(file)));
          } else {
            copyFolderRecursiveSync(file, androidDrawablePath);
          }
        });
      }
      return modConfig;
    },
  ]);

async function copyFolderRecursiveSync(source, target) {
  if (!existsSync(target)) mkdirSync(target);

  const files = readdirSync(source);

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    const sourcePath = join(source, file);
    const targetPath = join(target, file);

    if (lstatSync(sourcePath).isDirectory()) {
      copyFolderRecursiveSync(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

module.exports = withDrawableAssets;
