import Constants from 'expo-constants';
import { Platform } from 'react-native';
import SpInAppUpdates, {
  AndroidInAppUpdateExtras,
  AndroidInstallStatus,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

import logger from './logger';

const HIGH_PRIORITY_UPDATE = 5; // Arbitrary, depends on how you handle priority in the Play Console
export const checkUpdate = () => {
  if (!__DEV__) {
    const inAppUpdates = new SpInAppUpdates(false);
    logger.log('[INAPP] Checking store version');
    inAppUpdates
      .checkNeedsUpdate({ curVersion: Constants.expoConfig?.version ?? '1.0.0' })
      .then((result) => {
        logger.log(`[INAPP] result: ${JSON.stringify(result)}`);
        if (result.shouldUpdate) {
          if (Platform.OS === 'android') {
            const updateOptions: StartUpdateOptions = {
              updateType:
              (result?.other as AndroidInAppUpdateExtras)?.updatePriority <= HIGH_PRIORITY_UPDATE // TODO: implement flexible
                ? IAUUpdateKind.IMMEDIATE
                : IAUUpdateKind.FLEXIBLE,
            };
            if (updateOptions.updateType === IAUUpdateKind.FLEXIBLE) {
              inAppUpdates.addStatusUpdateListener((ev) => {
                logger.log(`[INAPP] status: ${JSON.stringify(ev)}`);
                if (ev.status === AndroidInstallStatus.DOWNLOADED) logger.log('[INAPP] downloaded');
              });
            }
            inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
          }
        }
      })
      .catch((err) => {
        const msg = String(err?.message || err || 'Unknown error');
        // Play Core InstallException -6: device state not allowed (battery, storage, etc.)
        if (msg.includes('InstallException') && msg.includes(' -6')) {
          logger.warn('[INAPP] Update not allowed due to device state (-6). Skipping.');
          return;
        }
        // Other non-critical errors from sp-react-native-in-app-updates should not crash the app
        logger.warn(`[INAPP] checkNeedsUpdate failed: ${msg}`);
      });
    return inAppUpdates;
  }
};

