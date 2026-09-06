import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { useTranslation } from 'react-i18next';

import SettingRow from '~/components/SettingRow';
import { useAppDispatch } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setIntroViewed } from '~/redux/reducers/settingsSlice';

const ResetIntroSetting = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppTheme();

  return (
    <SettingRow
      icon={<AntDesign name={'reload1'} size={24} color={theme.colors.text} />}
      label={t('settings.resetIntro')}
      onPress={() => dispatch(setIntroViewed(false))}
    />
  );
};

export default ResetIntroSetting;
