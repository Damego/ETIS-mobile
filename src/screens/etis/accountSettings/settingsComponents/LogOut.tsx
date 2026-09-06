import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { cache } from '~/cache/smartCache';
import BaseSettingButton from '~/components/baseSettingButton';
import { useAppDispatch } from '~/hooks';
import { signOut } from '~/redux/reducers/accountSlice';
import { unregisterBackgroundFetchAsync } from '~/tasks/signs/signs';

const LogOut = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const doSignOut = async () => {
    await cache.clear(true);
    dispatch(signOut({ cleanUserCredentials: true }));
    unregisterBackgroundFetchAsync().catch((error) => error);
  };

  const handlePress = () => {
    Alert.alert(
      t('account.logoutTitle'),
      t('account.logoutConfirmation'),
      [
        {
          text: t('common.cancel'),
        },
        {
          text: t('account.logout'),
          onPress: doSignOut,
        },
      ]
    );
  };

  return (
    <BaseSettingButton
      iconName={'logout'}
      label={t('account.logout')}
      onPress={handlePress}
      color={'primary'}
    />
  );
};

export default LogOut;
