import React from 'react';
import { Text } from 'react-native';

import Card from '../../components/Card';
import CardHeaderOut from '../../components/CardHeaderOut';
import Screen from '../../components/Screen';
import AboutAppButton from './AboutApp';
import ChangePersonalRecord from './ChangePersonalRecord';
import ResetIntroSetting from './ResetIntroSetting';
import SignOut from './SignOut';
import ToggleSignNotification from './ToggleSignNotification';
import ToggleThemeSetting from './ToggleThemeSetting';

export default function Settings() {
  return (
    <Screen>
      <Card style={{ zIndex: 1 }}>
        <ToggleThemeSetting />
      </Card>
      <Card>
        <ToggleSignNotification />
      </Card>
      <Card>
        <ResetIntroSetting />
      </Card>
      <CardHeaderOut topText={'Приложение'}>
        <AboutAppButton />
      </CardHeaderOut>
      <Text>Аккаунт</Text>
      <Card>
        <ChangePersonalRecord />
      </Card>
      <Card>
        <SignOut />
      </Card>
    </Screen>
  );
}
