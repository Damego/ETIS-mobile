import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cache } from '~/cache/smartCache';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { AccountType, clearAccountState, signOut } from '~/redux/reducers/accountSlice';
import { unregisterBackgroundFetchAsync } from '~/tasks/signs/signs';
import { fontSize } from '~/utils/texts';

import ChangeEmailSetting from './settingsComponents/ChangeEmailSetting';
import ChangePasswordSetting from './settingsComponents/ChangePasswordSetting';
import LogOut from './settingsComponents/LogOut';

const Settings = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const accountType = useAppSelector((state) => state.account.accountType);

  const onLogOutPress = async () => {
    router.dismissTo('(start)');
    await cache.clear(true);
    if (accountType === AccountType.AUTHORIZED_STUDENT) {
      dispatch(signOut({ cleanUserCredentials: true }));
      unregisterBackgroundFetchAsync().catch((error) => error);
    } else {
      dispatch(clearAccountState());
      cache.clearAccountData();
    }
  };

  return (
    <View style={styles.card}>
      <Text style={[fontSize.big, { fontWeight: 'bold', marginVertical: '4%' }]}>
        Действия с аккаунтом
      </Text>
      {accountType === AccountType.AUTHORIZED_STUDENT && (
        <>
          <ChangeEmailSetting />
          <ChangePasswordSetting />
        </>
      )}
      <LogOut onPress={onLogOutPress} />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: '2%',
  },
});
