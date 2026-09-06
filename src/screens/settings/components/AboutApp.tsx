import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { ServicesNavigationProp } from '~/navigation/types';

const AboutAppButton = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ServicesNavigationProp>();
  const theme = useAppTheme();

  return (
    <SettingRow
      label={t('settings.aboutApp')}
      icon={<AntDesign name={'infocirlceo'} size={24} color={theme.colors.text} />}
      onPress={() => navigation.navigate('AboutApp')}
      right={<AntDesign name={'right'} size={20} color={theme.colors.text} />}
    />
  );
};

export default AboutAppButton;
