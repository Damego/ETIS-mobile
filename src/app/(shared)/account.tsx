import React from 'react';
import Screen from '~/components/Screen';
import AccountInfo from '~/components/account/AccountInfo';
import PersonalRecords from '~/components/account/PersonalRecords';
import Settings from '~/components/account/Settings';
import UserInfo from '~/components/account/UserInfo';
import { useAppSelector } from '~/hooks';
import { AccountType } from '~/redux/reducers/accountSlice';

const AccountSettings = () => {
  const { accountType } = useAppSelector((state) => state.account);

  return (
    <Screen containerStyle={{ gap: 16 }}>
      {accountType === AccountType.AUTHORIZED_STUDENT ? <UserInfo /> : <AccountInfo />}
      <Settings />
      {accountType === AccountType.AUTHORIZED_STUDENT && <PersonalRecords />}
    </Screen>
  );
};

export default AccountSettings;
