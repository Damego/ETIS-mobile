import Constants from 'expo-constants';
import { Platform } from 'react-native';
import SpInAppUpdates, {
  AndroidInstallStatus,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { AndroidInAppUpdateExtras } from 'sp-react-native-in-app-updates/lib/typescript/types';

const HIGH_PRIORITY_UPDATE = 5; // Arbitrary, depends on how you handle priority in the Play Console
export const checkUpdate = (setReady) => {
  const inAppUpdates = new SpInAppUpdates(false);
  console.log('[INAPP] Checking store version');
  inAppUpdates.checkNeedsUpdate({ curVersion: Constants.expoConfig.version }).then((result) => {
    console.log('[INAPP] result: ' + JSON.stringify(result));
    if (result.shouldUpdate) {
      if (Platform.OS === 'android') {
        const updateOptions: StartUpdateOptions = {
          updateType:
            (result?.other as AndroidInAppUpdateExtras)?.updatePriority <= HIGH_PRIORITY_UPDATE // TODO: implement flexible
              ? IAUUpdateKind.IMMEDIATE
              : IAUUpdateKind.FLEXIBLE,
        };
        inAppUpdates.addStatusUpdateListener((ev) => {
          console.debug(`[INAPP] status: ${JSON.stringify(ev)}`);
          if (ev.status === AndroidInstallStatus.DOWNLOADED) setReady(true);
        });
        inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
      }
    }
  });
  return inAppUpdates;
};

export const installUpdate = (spInAppUpdates: SpInAppUpdates) => spInAppUpdates.installUpdate();
