import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/hooks/theme';
import { RootStackNavigationProp } from '~/navigation/types';

const AppSettingButton = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AppSettings');
      }}
      style={{ justifyContent: 'center' }}
    >
      <AntDesign name="setting" size={28} color={theme.colors.primary} />
    </TouchableOpacity>
  );
};

export default AppSettingButton;
