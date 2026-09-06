import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { cache } from '~/cache/smartCache';
import SettingRow from '~/components/SettingRow';
import { useAppDispatch } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setIntroViewed } from '~/redux/reducers/settingsSlice';

const ResetIntroSetting = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppTheme();

  const resetIntro = () => {
    // Сброс идёт парой: redux + персистентный кэш. Без записи в кэш
    // loadSettings при рестарте читал бы config.introViewed=true,
    // и интро не показывалось бы
    dispatch(setIntroViewed(false));
    void cache.placeIntroViewed(false);
    Alert.alert(t('settings.restartApp'), t('settings.resetIntroDescription'));
  };

  return (
    <SettingRow
      icon={<AntDesign name={'reload1'} size={24} color={theme.colors.text} />}
      label={t('settings.resetIntro')}
      onPress={resetIntro}
    />
  );
};

export default ResetIntroSetting;
