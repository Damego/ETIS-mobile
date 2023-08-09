import React from 'react';
import { Alert } from 'react-native';

import ClickableText from '../../components/ClickableText';
import { useAppDispatch, useGlobalStyles } from '../../hooks';
import { signOut } from '../../redux/reducers/authSlice';
import { storage } from '../../utils';
import { fontSize } from '../../utils/texts';
import { unregisterBackgroundFetchAsync } from '../../tasks/signs';
import { cache } from '../../cache/smartCache';

const SignOut = () => {
  const dispatch = useAppDispatch();
  const globalStyles = useGlobalStyles();

  const doSignOut = async () => {
    await cache.deleteUserCredentials();
    dispatch(signOut({ cleanUserCredentials: true }));
    try {
      unregisterBackgroundFetchAsync();
    } catch (error) {
      /* empty */
    }
  };

  const confirmSignOut = () => {
    Alert.alert('Выход из аккаунта', 'Вы действительно хотите выйти из аккаунта?', [
      {
        text: 'Отмена',
      },
      {
        text: 'Выйти',
        onPress: doSignOut,
      },
    ]);
  };

  return (
    <ClickableText
      text="Выйти из аккаунта"
      textStyle={[fontSize.medium, { fontWeight: '500' }, globalStyles.primaryFontColor]}
      onPress={confirmSignOut}
    />
  );
};

export default SignOut;
