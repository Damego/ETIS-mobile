import React from 'react';
import Screen from '~/components/Screen';
import { useAppSelector } from '~/hooks';
import { TimetableModes } from '~/redux/reducers/settingsSlice';

import ChangeTimetableMode from './components/ChangeTimetableMode';
import ToggleHighlightCurrentDay from './components/ToggleHighlightCurrentDay';
import ToggleShowEmptyPairs from './components/ToggleShowEmptyPairs';
import ToggleShowGapsBetweenPairs from './components/ToggleShowGapsBetweenPairs';
import ToggleShowPastWeekDays from './components/ToggleShowPastWeekDays';
import ToggleSkipSunday from './components/ToggleSkipSunday';

const ChangeAppUI = () => {
  const { timetableMode } = useAppSelector((state) => state.settings.config.ui);

  return (
    <Screen containerStyle={{ gap: 8 }}>
      <ToggleSkipSunday />
      <ToggleShowEmptyPairs />
      <ToggleShowGapsBetweenPairs />
      <ChangeTimetableMode />
      {timetableMode === TimetableModes.weeks && (
        <>
          <ToggleShowPastWeekDays />
          <ToggleHighlightCurrentDay />
        </>
      )}
    </Screen>
  );
};

export default ChangeAppUI;
