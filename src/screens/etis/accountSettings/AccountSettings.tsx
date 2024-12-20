import React from 'react';
import Screen from '~/components/Screen';
import Settings from '~/screens/etis/accountSettings/Settings';
import UserInfo from '~/screens/etis/accountSettings/UserInfo';

import PersonalRecords from './PersonalRecords';

const AccountSettings = () => {
  return (
    <Screen containerStyle={{ gap: 16 }}>
      <UserInfo />
      <Settings />
      <PersonalRecords />
    </Screen>
  );
};

export default AccountSettings;
