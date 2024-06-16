import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/hooks/theme';
import { EducationNavigationProp } from '~/navigation/types';

const AccountSettingsButton = () => {
  const navigation = useNavigation<EducationNavigationProp>();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('AccountSettings');
      }}
      style={{
        justifyContent: 'center',
        marginHorizontal: 14,
      }}
    >
      <AntDesign name="user" size={28} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export default AccountSettingsButton;
