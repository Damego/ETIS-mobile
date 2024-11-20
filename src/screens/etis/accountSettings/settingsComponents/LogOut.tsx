import React from 'react';
import { Alert } from 'react-native';
import { cache } from '~/cache/smartCache';
import BaseSettingButton from '~/components/baseSettingButton';
import { useAppDispatch } from '~/hooks';
import { signOut } from '~/redux/reducers/accountSlice';
import { unregisterBackgroundFetchAsync } from '~/tasks/signs/signs';

const LogOut = () => {
  const dispatch = useAppDispatch();

  const doSignOut = async () => {
    await cache.clear(true);
    dispatch(signOut({ cleanUserCredentials: true }));
    unregisterBackgroundFetchAsync().catch((error) => error);
  };

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
          onPress: doSignOut,
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
