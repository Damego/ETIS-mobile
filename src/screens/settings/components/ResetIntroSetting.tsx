import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import SettingRow from '~/components/SettingRow';
import { useAppDispatch } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setIntroViewed } from '~/redux/reducers/settingsSlice';

const ResetIntroSetting = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppTheme();

  const resetIntro = () => {
    // Флаг intentionally не пишется в хранилище: интро показывается
    // до следующей записи конфига, затем снова считается просмотренным
    dispatch(setIntroViewed(false));
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
