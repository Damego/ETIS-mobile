import React from 'react';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleSkipSunday = () => {
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { skipSunday: !skipSunday };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <SettingRow
      label='Пропускать воскресенье'
      right={<ThemedSwitch onValueChange={toggle} value={skipSunday} />}
    />
  );
};

export default ToggleSkipSunday;
