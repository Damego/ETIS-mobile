import React from 'react';
import Screen from '~/components/Screen';
import UserInfo from '~/screens/etis/accountSettings/UserInfo';
import PersonalRecords from './PersonalRecords';
import Settings from '~/screens/etis/accountSettings/Settings';

const AccountSettings = () => {
  return (
    <Screen>
      <UserInfo />
      <Settings />
      <PersonalRecords />
    </Screen>
  );
};

export default AccountSettings;
