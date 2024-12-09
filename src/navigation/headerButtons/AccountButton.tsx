import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppTheme } from '~/hooks/theme';

const AccountButton = () => {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        router.push('(shared)/account');
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

export default AccountButton;
