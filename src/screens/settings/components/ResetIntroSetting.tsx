import { AntDesign } from '@expo/vector-icons';
import React from 'react';

import SettingRow from '~/components/SettingRow';
import { useAppDispatch } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setIntroViewed } from '~/redux/reducers/settingsSlice';

const ResetIntroSetting = () => {
  const dispatch = useAppDispatch();
  const theme = useAppTheme();

  return (
    <SettingRow
      icon={<AntDesign name={'reload1'} size={24} color={theme.colors.text} />}
      label='Сбросить обучение'
      onPress={() => dispatch(setIntroViewed(false))}
    />
  );
};

export default ResetIntroSetting;
