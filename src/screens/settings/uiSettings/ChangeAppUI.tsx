import React from 'react';
import Screen from '~/components/Screen';
import { useAppSelector } from '~/hooks';
import { TimetableModes } from '~/redux/reducers/settingsSlice';
import ChangeTimetableMode from '~/screens/settings/uiSettings/components/ChangeTimetableMode';
import ToggleHighlightCurrentDay from '~/screens/settings/uiSettings/components/ToggleHighlightCurrentDay';
import ToggleShowPastWeekDays from '~/screens/settings/uiSettings/components/ToggleShowPastWeekDays';
import ToggleSkipSunday from '~/screens/settings/uiSettings/components/ToggleSkipSunday';

const ChangeAppUI = () => {
  const { timetableMode } = useAppSelector((state) => state.settings.config.ui);

  return (
    <Screen containerStyle={{ gap: 8 }}>
      <ToggleSkipSunday />
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
