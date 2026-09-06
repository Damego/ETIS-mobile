import React from 'react';
import { useTranslation } from 'react-i18next';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleShowPastWeekDays = () => {
  const { t } = useTranslation();
  const { showPastWeekDays } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { showPastWeekDays: !showPastWeekDays };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <SettingRow
      label={t('settings.hidePastWeekDays')}
      right={<ThemedSwitch value={!showPastWeekDays} onValueChange={toggle} />}
    />
  );
};

export default ToggleShowPastWeekDays;
