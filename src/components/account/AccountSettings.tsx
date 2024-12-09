import React from 'react';
import Screen from '~/components/Screen';
import AccountInfo from '~/components/account/AccountInfo';
import { useAppSelector } from '~/hooks';
import { AccountType } from '~/redux/reducers/accountSlice';

import PersonalRecords from './PersonalRecords';
import Settings from './Settings';
import UserInfo from './UserInfo';

const AccountSettings = () => {
  const { accountType } = useAppSelector((state) => state.account);
  console.log('AT', accountType)
  return (
    <Screen containerStyle={{ gap: 16 }}>
      {accountType === AccountType.AUTHORIZED_STUDENT ? <UserInfo /> : <AccountInfo />}
      <Settings />
      {accountType === AccountType.AUTHORIZED_STUDENT && <PersonalRecords />}
    </Screen>
  );
};

export default AccountSettings;
