import React from 'react';
import Card from '~/components/Card';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TelegramAppChannel from '~/screens/settings/components/TelegramAppChannel';
import { fontSize } from '~/utils/texts';

import AboutAppButton from './components/AboutApp';
import ChangeAppUI from './components/ChangeAppUI';
import ShowReleaseNotes from './components/ShowReleaseNotes';
import ToggleSentrySetting from './components/ToggleSentrySetting';
import ToggleSignNotification from './components/ToggleSignNotification';
import ToggleThemeSetting from './components/ToggleThemeSetting';

export default function AppSettings() {
  return (
    <Screen containerStyle={{ gap: 8 }}>
      {/* Общие настройки */}
      <Card style={{ zIndex: 1 }}>
        <ToggleThemeSetting />
      </Card>
      <ChangeAppUI />
      <Card>
        <ToggleSignNotification />
      </Card>
      {/*<Card>*/}
      {/*  <ResetIntroSetting />*/}
      {/*</Card>*/}

      {/* Настройки приложения */}
      <Text style={[fontSize.big, { fontWeight: 'bold' }]}>Приложение</Text>
      <ShowReleaseNotes />
      <AboutAppButton />
      <ToggleSentrySetting />
      <TelegramAppChannel />
    </Screen>
  );
}
