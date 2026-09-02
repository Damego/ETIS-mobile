import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { RootStackNavigationProp } from '~/navigation/types';

const ChangeAppUI = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const theme = useAppTheme();

  const onPress = () => {
    navigation.navigate('ChangeAppUI');
  };

  return (
    <SettingRow
      label='Настройки интерфейса'
      icon={<AntDesign name={'picture'} size={24} color={theme.colors.text} />}
      onPress={onPress}
      right={<AntDesign name={'right'} size={20} color={theme.colors.text} />}
    />
  );
};

export default ChangeAppUI;
