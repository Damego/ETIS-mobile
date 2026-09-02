import React from 'react';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleShowGapsBetweenPairs = () => {
  const { showGapsBetweenPairs, showEmptyPairs } = useAppSelector(
    (state) => state.settings.config.ui
  );
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { showGapsBetweenPairs: !showGapsBetweenPairs };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <SettingRow
      label='Показывать пропуски между парами'
      right={
        <ThemedSwitch
          onValueChange={toggle}
          value={showGapsBetweenPairs}
          disabled={showEmptyPairs}
        />
      }
    />
  );
};

export default ToggleShowGapsBetweenPairs;
