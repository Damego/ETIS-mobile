import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { TimetableModes, setUIConfig } from '~/redux/reducers/settingsSlice';

const ToggleModeButton = () => {
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
    <TouchableOpacity onPress={toggle}>
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
