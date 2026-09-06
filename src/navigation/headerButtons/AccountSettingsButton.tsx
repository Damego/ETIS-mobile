import AntDesign from '@expo/vector-icons/AntDesign';
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
      style={{
        justifyContent: 'center',
        marginHorizontal: 14,
      }}
      onPress={() => {
        navigation.navigate('AccountSettings');
      }}
    >
      <AntDesign name='user' size={28} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

export default AccountSettingsButton;
