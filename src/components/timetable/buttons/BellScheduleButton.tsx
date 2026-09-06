import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { useAppTheme } from '~/hooks/theme';
import { EducationNavigationProp } from '~/navigation/types';

const BellScheduleButton = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<EducationNavigationProp>();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('BellSchedule')}
      accessibilityRole='button'
      accessibilityLabel={t('navigation.bellSchedule')}
      hitSlop={
        {
          top: 12,
          bottom: 12,
          left: 12,
          right: 12,
        }
      }
    >
      <AntDesign name={'bells'} size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export default BellScheduleButton;
