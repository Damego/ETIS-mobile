import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { RootStackNavigationProp } from '~/navigation/types';

const ShowReleaseNotes = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const theme = useAppTheme();

  const onPress = () => {
    navigation.navigate('ReleaseNotes');
  };

  return (
    <SettingRow
      label='Список изменений'
      icon={<AntDesign name={'copy1'} size={24} color={theme.colors.text} />}
      onPress={onPress}
      right={<AntDesign name={'right'} size={20} color={theme.colors.text} />}
    />
  );
};

export default ShowReleaseNotes;
