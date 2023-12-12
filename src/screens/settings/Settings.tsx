import React from 'react';

import Card from '../../components/Card';
import CardHeaderOut from '../../components/CardHeaderOut';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';
import AboutAppButton from './AboutApp';
import ChangeEmailSetting from './ChangeEmailSetting';
import ChangePasswordSetting from './ChangePasswordSetting';
import ChangePersonalRecord from './ChangePersonalRecord';
import ResetIntroSetting from './ResetIntroSetting';
import SignOut from './SignOut';
import ToggleSentrySetting from './ToggleSentrySetting';
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
      <ToggleSentrySetting />
      <Text style={[fontSize.medium, { fontWeight: 'bold', marginBottom: '2%' }]}>Аккаунт</Text>
      <ChangePasswordSetting />
      <ChangeEmailSetting />
      <Card>
        <ChangePersonalRecord />
      </Card>
      <Card>
        <SignOut />
      </Card>
    </Screen>
  );
}
