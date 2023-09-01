import Constants from 'expo-constants';
import { Platform } from 'react-native';
import SpInAppUpdates, { IAUUpdateKind, StartUpdateOptions } from 'sp-react-native-in-app-updates';

export const checkUpdate = () => {
  const inAppUpdates = new SpInAppUpdates(
    true // todo: disable
  );
  console.log('[INAPP] Checking store version');
  inAppUpdates.checkNeedsUpdate({ curVersion: Constants.expoConfig.version }).then((result) => {
    console.log('[INAPP] result: ' + JSON.stringify(result));
    if (result.shouldUpdate) {
      let updateOptions: StartUpdateOptions = {};
      if (Platform.OS === 'android') {
        // android only, on iOS the user will be promped to go to your app store page
        updateOptions = {
          updateType: IAUUpdateKind.FLEXIBLE,
        };
      }
      inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
    }
  });
};
