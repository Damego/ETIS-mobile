import { Alert, Linking } from 'react-native';

import i18next from '~/i18n';

import { DEBUG_GUIDE_URL } from './consts';

const alertParserBugReport = () =>
  Alert.alert(
    i18next.t('debug.title'),
    i18next.t('debug.message'),
    [
      {
        text: i18next.t('common.back'),
      },
      {
        text: i18next.t('debug.open'),
        onPress: () => Linking.openURL(DEBUG_GUIDE_URL),
      },
    ]
  );

export default alertParserBugReport;
