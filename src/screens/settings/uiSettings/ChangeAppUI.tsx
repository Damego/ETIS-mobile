import React from 'react';
import Screen from '~/components/Screen';
import { useAppSelector } from '~/hooks';
import { TimetableModes } from '~/redux/reducers/settingsSlice';
import ChangeTimetableMode from '~/screens/settings/uiSettings/components/ChangeTimetableMode';
import ToggleHighlightCurrentDay from '~/screens/settings/uiSettings/components/ToggleHighlightCurrentDay';
import ToggleShowPastWeekDays from '~/screens/settings/uiSettings/components/ToggleShowPastWeekDays';

const ChangeAppUI = () => {
  const { timetableMode } = useAppSelector((state) => state.settings.config.ui);

  return (
    <Screen containerStyle={{ gap: 8 }}>
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
