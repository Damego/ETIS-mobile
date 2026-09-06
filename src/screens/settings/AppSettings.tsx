import React from 'react';
import { useTranslation } from 'react-i18next';

import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TelegramAppChannel from '~/screens/settings/components/TelegramAppChannel';
import { fontSize } from '~/utils/texts';

import AboutAppButton from './components/AboutApp';
import ChangeAppUI from './components/ChangeAppUI';
import ChangeEventTheme from './components/ChangeEventTheme';
import LanguageSetting from './components/LanguageSetting';
import ResetIntroSetting from './components/ResetIntroSetting';
import ShowReleaseNotes from './components/ShowReleaseNotes';
import ToggleSentrySetting from './components/ToggleSentrySetting';
import ToggleSignNotification from './components/ToggleSignNotification';
import ToggleThemeSetting from './components/ToggleThemeSetting';

export default function AppSettings() {
  const { t } = useTranslation();

  return (
    <Screen containerStyle={{ gap: 8 }}>
      {/* Общие настройки */}
      <ToggleThemeSetting />
      <ChangeEventTheme />
      <ChangeAppUI />
      <ToggleSignNotification />
      <LanguageSetting />
      <ResetIntroSetting />

      {/* Настройки приложения */}
      <Text style={[fontSize.big, { fontWeight: 'bold' }]}>{t('settings.appSection')}</Text>
      <ShowReleaseNotes />
      <AboutAppButton />
      <ToggleSentrySetting />
      <TelegramAppChannel />
    </Screen>
  );
}
