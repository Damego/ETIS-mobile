import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Linking } from 'react-native';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { TELEGRAM_URL } from '~/utils';

const TelegramAppChannel = () => {
  const theme = useAppTheme();

  return (
    <SettingRow
      label='Наш телеграм канал'
      icon={<FontAwesome name={'telegram'} size={24} color={theme.colors.text} />}
      onPress={() => Linking.openURL(TELEGRAM_URL)}
      right={<AntDesign name={'right'} size={20} color={theme.colors.text} />}
    />
  );
};

export default TelegramAppChannel;
