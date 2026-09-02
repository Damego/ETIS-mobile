import React from 'react';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleHighlightCurrentDay = () => {
  const { highlightCurrentDay } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { highlightCurrentDay: !highlightCurrentDay };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <SettingRow
      label='Выделять текущий день недели'
      right={<ThemedSwitch onValueChange={toggle} value={highlightCurrentDay} />}
    />
  );
};

export default ToggleHighlightCurrentDay;
