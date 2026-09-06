import { Alert, Linking } from 'react-native';

import i18next from '~/i18n';

import { cache } from '../cache/smartCache';
import { PRIVACY_POLICY_URL } from './consts';

const showPrivacyPolicy = () => {
  Alert.alert(
    i18next.t('privacyPolicy.title'),
    i18next.t('privacyPolicy.message'),
    [
      {
        text: i18next.t('privacyPolicy.open'),
        onPress: () => {
          showPrivacyPolicy();
          Linking.openURL(PRIVACY_POLICY_URL);
        },
      },
      { text: i18next.t('privacyPolicy.accept'), onPress: () => cache.setPrivacyPolicyStatus(true) },
    ]
  );
};

export default showPrivacyPolicy;
