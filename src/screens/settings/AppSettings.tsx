import React from 'react';

import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TelegramAppChannel from '~/screens/settings/components/TelegramAppChannel';
import { fontSize } from '~/utils/texts';

import AboutAppButton from './components/AboutApp';
import ChangeAppUI from './components/ChangeAppUI';
import ChangeEventTheme from './components/ChangeEventTheme';
import ShowReleaseNotes from './components/ShowReleaseNotes';
import ToggleSentrySetting from './components/ToggleSentrySetting';
import ToggleSignNotification from './components/ToggleSignNotification';
import ToggleThemeSetting from './components/ToggleThemeSetting';

export default function AppSettings() {
  return (
    <Screen containerStyle={{ gap: 8 }}>
      {/* Общие настройки */}
      <ToggleThemeSetting />
      <ChangeEventTheme />
      <ChangeAppUI />
      <ToggleSignNotification />

      {/* Настройки приложения */}
      <Text style={[fontSize.big, { fontWeight: 'bold' }]}>Приложение</Text>
      <ShowReleaseNotes />
      <AboutAppButton />
      <ToggleSentrySetting />
      <TelegramAppChannel />
    </Screen>
  );
}
