import React from 'react';

import Screen from '../../../components/Screen';
import ToggleHighlightCurrentDay from './toggles/ToggleHighlightCurrentDay';
import ToggleShowPastWeekDays from './toggles/ToggleShowPastWeekDays';

const ChangeAppUI = () => {
  return (
    <Screen>
      <ToggleShowPastWeekDays />
      <ToggleHighlightCurrentDay />
    </Screen>
  );
};

export default ChangeAppUI;
