import React from 'react';
import { Alert } from 'react-native';
import BaseSettingButton from '~/components/baseSettingButton';

const LogOut = ({ onPress }: { onPress: () => void }) => {
  const handlePress = () => {
    Alert.alert(
      'Выход из аккаунта',
      'Вы действительно хотите выйти из аккаунта? Это действие удалит все ваши данные.',
      [
        {
          text: 'Отмена',
        },
        {
          text: 'Выйти',
          onPress: onPress,
        },
      ]
    );
  };

  return (
    <BaseSettingButton
      iconName={'logout'}
      label={'Выйти'}
      onPress={handlePress}
      color={'primary'}
    />
  );
};

export default LogOut;
