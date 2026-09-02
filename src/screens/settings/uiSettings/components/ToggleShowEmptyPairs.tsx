import React from 'react';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleShowEmptyPairs = () => {
  const { showEmptyPairs } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { showEmptyPairs: !showEmptyPairs };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <SettingRow
      label='Показывать пустые пары'
      right={<ThemedSwitch onValueChange={toggle} value={showEmptyPairs} />}
    />
  );
};

export default ToggleShowEmptyPairs;
