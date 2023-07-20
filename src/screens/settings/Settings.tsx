import React from 'react';

import Card from '../../components/Card';
import CardHeaderOut from '../../components/CardHeaderOut';
import Screen from '../../components/Screen';
import AboutAppButton from './AboutApp';
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
      <CardHeaderOut topText={'Аккаунт'}>
        <SignOut />
      </CardHeaderOut>
    </Screen>
  );
}
