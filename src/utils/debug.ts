import { Alert, Linking } from 'react-native';

import { DEBUG_GUIDE_URL } from './consts';

export const alertParserBugReport = () =>
  Alert.alert(
    'Произошла ошибка парсера',
    'Вероятно, Вы столкнулись с неожиданным поведением ЕТИС.\n' +
      'Будем рады если сообщите нам подробности!',
    [
      {
        text: 'Открыть',
        onPress: () => Linking.openURL(DEBUG_GUIDE_URL),
      },
    ]
  );
