import React from 'react';

import Card from '../../components/Card';
import CardHeaderOut from '../../components/CardHeaderOut';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import { fontSize } from '../../utils/texts';
import AboutAppButton from './components/AboutApp';
import ChangeAppUI from './components/ChangeAppUI';
import ChangeEmailSetting from './components/ChangeEmailSetting';
import ChangeNewYearTheme from './components/ChangeNewYearTheme';
import ChangePasswordSetting from './components/ChangePasswordSetting';
import ChangePersonalRecord from './components/ChangePersonalRecord';
import ResetIntroSetting from './components/ResetIntroSetting';
import ShowReleaseNotes from './components/ShowReleaseNotes';
import SignOut from './components/SignOut';
import ToggleSentrySetting from './components/ToggleSentrySetting';
import ToggleSignNotification from './components/ToggleSignNotification';
import ToggleThemeSetting from './components/ToggleThemeSetting';

export default function Settings() {
  return (
    <Screen>
      {/* Общие настройки */}
      <Card style={{ zIndex: 1 }}>
        <ToggleThemeSetting />
      </Card>
      <ChangeAppUI />
      <ChangeNewYearTheme />
      <Card>
        <ToggleSignNotification />
      </Card>
      <Card>
        <ResetIntroSetting />
      </Card>

      {/* Настройки приложения */}
      <Text style={[fontSize.medium, { fontWeight: 'bold', marginBottom: '2%' }]}>Приложение</Text>
      <ShowReleaseNotes />
      <AboutAppButton />
      <ToggleSentrySetting />

      {/* Настройки аккаунта пользователя(студента) */}
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
