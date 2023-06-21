import React from 'react';

import Card from '../../components/Card';
import Screen from '../../components/Screen';
import ResetIntroSetting from './ResetIntroSetting';
import ToggleSignNotification from './ToggleSignNotification';
import ToggleThemeSetting from './ToggleThemeSetting';

export default function Settings() {
  return (
    <Screen disableRefresh>
      <Card style={{ zIndex: 1 }}>
        <ToggleThemeSetting />
      </Card>
      <Card>
        <ToggleSignNotification />
      </Card>
      <Card>
        <ResetIntroSetting />
      </Card>
    </Screen>
  );
}
