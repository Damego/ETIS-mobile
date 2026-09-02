import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

import SettingRow from '~/components/SettingRow';
import { useAppTheme } from '~/hooks/theme';
import { ServicesNavigationProp } from '~/navigation/types';

const AboutAppButton = () => {
  const navigation = useNavigation<ServicesNavigationProp>();
  const theme = useAppTheme();

  return (
    <SettingRow
      label='О приложении'
      icon={<AntDesign name={'infocirlceo'} size={24} color={theme.colors.text} />}
      onPress={() => navigation.navigate('AboutApp')}
      right={<AntDesign name={'right'} size={20} color={theme.colors.text} />}
    />
  );
};

export default AboutAppButton;
