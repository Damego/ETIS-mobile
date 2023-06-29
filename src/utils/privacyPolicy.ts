import { Alert, Linking } from 'react-native';
import { PRIVACY_POLICY_URL } from './consts';
import { storage } from './index';

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
      { text: 'Принять', onPress: () => storage.acceptPrivacyPolicy() },
    ]
  );
};

export default showPrivacyPolicy;