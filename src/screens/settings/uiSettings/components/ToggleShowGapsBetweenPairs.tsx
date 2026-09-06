import React from 'react';
import { useTranslation } from 'react-i18next';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleShowGapsBetweenPairs = () => {
  const { t } = useTranslation();
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
      label={t('settings.showGapsBetweenPairs')}
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
