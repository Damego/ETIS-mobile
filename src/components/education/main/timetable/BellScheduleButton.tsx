import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/hooks/theme';
import { useRouter } from 'expo-router';

const BellScheduleButton = () => {
  const router = useRouter()
  const theme = useAppTheme();

  return (
    <TouchableOpacity onPress={() => router.push('(shared)/bellSchedule')}>
      <AntDesign name={'bells'} size={24} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export default BellScheduleButton;
