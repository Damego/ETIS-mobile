import { Alert, Linking } from 'react-native';

import { cache } from '../cache/smartCache';
import { PRIVACY_POLICY_URL } from './consts';

const showPrivacyPolicy = () => {
  Alert.alert(
    'Политика конфиденциальности',
    'Перед использованием приложения необходимо прочитать и принять политику конфиденциальности',
    [
      {
        text: 'Открыть',
        onPress: () => {
          showPrivacyPolicy();
          Linking.openURL(PRIVACY_POLICY_URL);
        },
      },
      { text: 'Принять', onPress: () => cache.setPrivacyPolicyStatus(true) },
    ]
  );
};

export default showPrivacyPolicy;
