import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/hooks/theme';
import { EducationNavigationProp } from '~/navigation/types';

const BellScheduleButton = () => {
  const navigation = useNavigation<EducationNavigationProp>();
  const theme = useAppTheme();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('BellSchedule')}>
      <AntDesign name={'bells'} size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export default BellScheduleButton;
