import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { useAppDispatch, useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { setUIConfig, TimetableModes } from '~/redux/reducers/settingsSlice';

const ToggleModeButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { timetableMode } = useAppSelector((state) => state.settings.config.ui);
  const theme = useAppTheme();

  const toggle = () => {
    dispatch(
      setUIConfig({
        timetableMode:
          timetableMode === TimetableModes.days ? TimetableModes.weeks : TimetableModes.days,
      })
    );
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      accessibilityRole='button'
      accessibilityLabel={t('timetable.switchMode')}
      hitSlop={
        {
          top: 12,
          bottom: 12,
          left: 12,
          right: 12,
        }
      }
    >
      {timetableMode === TimetableModes.weeks && (
        <Ionicons name={'menu'} size={24} color={theme.colors.text} />
      )}
      {timetableMode === TimetableModes.days && (
        <Ionicons name={'pause-outline'} size={24} color={theme.colors.text} />
      )}
    </TouchableOpacity>
  );
};

export default ToggleModeButton;
