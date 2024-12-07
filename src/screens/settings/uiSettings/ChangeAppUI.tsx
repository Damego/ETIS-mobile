import React from 'react';
import Screen from '~/components/Screen';
import { useAppSelector } from '~/hooks';
import { TimetableModes } from '~/redux/reducers/settingsSlice';
import ChangeTimetableMode from '~/screens/settings/uiSettings/components/ChangeTimetableMode';
import ToggleHighlightCurrentDay from '~/screens/settings/uiSettings/components/ToggleHighlightCurrentDay';
import ToggleShowEmptyPairs from '~/screens/settings/uiSettings/components/ToggleShowEmptyPairs';
import ToggleShowGapsBetweenPairs from '~/screens/settings/uiSettings/components/ToggleShowGapsBetweenPairs';
import ToggleShowPastWeekDays from '~/screens/settings/uiSettings/components/ToggleShowPastWeekDays';
import ToggleSkipSunday from '~/screens/settings/uiSettings/components/ToggleSkipSunday';

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
