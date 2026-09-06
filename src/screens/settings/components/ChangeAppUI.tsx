import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { RootStackNavigationProp } from '~/navigation/types';

const ChangeAppUI = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  const theme = useAppTheme();

  const onPress = () => {
    navigation.navigate('ChangeAppUI');
  };

  return (
    <SettingRow
      label={t('settings.interfaceSettings')}
      icon={<AntDesign name={'picture'} size={24} color={theme.colors.text} />}
      right={<AntDesign name={'right'} size={20} color={theme.colors.text} />}
      onPress={onPress}
    />
  );
};

export default ChangeAppUI;
