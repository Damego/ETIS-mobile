import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/hooks/theme';
import useAppRouter from '~/hooks/useAppRouter';

const AppSettingButton = () => {
  const router = useAppRouter();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push('(setting)');
      }}
      style={{ marginRight: '10%' }}
    >
      <AntDesign name="setting" size={28} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export default AppSettingButton;
