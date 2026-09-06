import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { TELEGRAM_URL } from '~/utils';

const TelegramAppChannel = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <SettingRow
      label={t('settings.telegramChannel')}
      icon={<FontAwesome name={'telegram'} size={24} color={theme.colors.text} />}
      onPress={() => Linking.openURL(TELEGRAM_URL)}
      right={<AntDesign name={'right'} size={20} color={theme.colors.text} />}
    />
  );
};

export default TelegramAppChannel;
