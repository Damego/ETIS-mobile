import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { RootStackNavigationProp } from '~/navigation/types';

const ShowReleaseNotes = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  const theme = useAppTheme();

  const onPress = () => {
    navigation.navigate('ReleaseNotes');
  };

  return (
    <SettingRow
      label={t('settings.releaseNotes')}
      icon={<AntDesign name={'copy1'} size={24} color={theme.colors.text} />}
      onPress={onPress}
      right={<AntDesign name={'right'} size={20} color={theme.colors.text} />}
    />
  );
};

export default ShowReleaseNotes;
