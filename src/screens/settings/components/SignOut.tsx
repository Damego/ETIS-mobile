import React from 'react';
import { Alert } from 'react-native';
import { cache } from '~/cache/smartCache';
import ClickableText from '~/components/ClickableText';
import { useAppDispatch } from '~/hooks';
import { signOut } from '~/redux/reducers/authSlice';
import { unregisterBackgroundFetchAsync } from '~/tasks/signs/signs';
import { fontSize } from '~/utils/texts';

const SignOut = () => {
  const dispatch = useAppDispatch();

  const doSignOut = async () => {
    await cache.clear(true);
    dispatch(signOut({ cleanUserCredentials: true }));
    unregisterBackgroundFetchAsync().catch((error) => error);
  };

  const confirmSignOut = () => {
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
    <ClickableText
      text="Выйти из аккаунта"
      textStyle={[fontSize.medium, { fontWeight: '500' }]}
      onPress={confirmSignOut}
      colorVariant={'primary'}
    />
  );
};

export default SignOut;
