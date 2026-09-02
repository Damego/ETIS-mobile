import React from 'react';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleShowPastWeekDays = () => {
  const { showPastWeekDays } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { showPastWeekDays: !showPastWeekDays };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <SettingRow
      label='Скрывать прошедшие дни недели'
      right={<ThemedSwitch onValueChange={toggle} value={!showPastWeekDays} />}
    />
  );
};

export default ToggleShowPastWeekDays;
