import React from 'react';
import { Text } from 'react-native';

import Card from '../../components/Card';
import CardHeaderOut from '../../components/CardHeaderOut';
import Screen from '../../components/Screen';
import { useGlobalStyles } from '../../hooks';
import { fontSize } from '../../utils/texts';
import AboutAppButton from './AboutApp';
import ChangeEmailSetting from './ChangeEmailSetting';
import ChangePasswordSetting from './ChangePasswordSetting';
import ChangePersonalRecord from './ChangePersonalRecord';
import ResetIntroSetting from './ResetIntroSetting';
import SignOut from './SignOut';
import ToggleSignNotification from './ToggleSignNotification';
import ToggleThemeSetting from './ToggleThemeSetting';

export default function Settings() {
  const globalStyles = useGlobalStyles();

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
      <Text
        style={[
          fontSize.medium,
          { fontWeight: 'bold', marginBottom: '2%' },
          globalStyles.textColor,
        ]}
      >
        Аккаунт
      </Text>
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
