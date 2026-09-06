import React from 'react';
import { useTranslation } from 'react-i18next';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import ThemedSwitch from '~/components/ThemedSwitch';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleHighlightCurrentDay = () => {
  const { t } = useTranslation();
  const { highlightCurrentDay } = useAppSelector((state) => state.settings.config.ui);
  const dispatch = useAppDispatch();

  const toggle = () => {
    const config = { highlightCurrentDay: !highlightCurrentDay };
    dispatch(setUIConfig(config));
    cache.setUIConfig(config);
  };

  return (
    <SettingRow
      label={t('settings.highlightCurrentDay')}
      right={<ThemedSwitch value={highlightCurrentDay} onValueChange={toggle} />}
    />
  );
};

export default ToggleHighlightCurrentDay;
