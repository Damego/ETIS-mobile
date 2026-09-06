import React from 'react';
import { useTranslation } from 'react-i18next';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleSkipSunday = () => {
  const { t } = useTranslation();
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { skipSunday: !skipSunday };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <SettingRow
      label={t('settings.skipSunday')}
      right={<ThemedSwitch value={skipSunday} onValueChange={toggle} />}
    />
  );
};

export default ToggleSkipSunday;
