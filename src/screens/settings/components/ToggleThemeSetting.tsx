import { Octicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { cache } from '~/cache/smartCache';
import BottomSheetModal from '~/components/BottomSheetModal';
import Text from '~/components/Text';
import OptionsBottomSheet from '~/components/bottomSheets/OptionsBottomSheet';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { changeTheme, setEvents } from '~/redux/reducers/settingsSlice';
import { ThemeType } from '~/styles/themes';
import { fontSize } from '~/utils/texts';

const options = [
  {
    label: 'Автоматическая',
    value: ThemeType.auto,
    isCurrent: false,
  },
  {
    label: 'Светлая',
    value: ThemeType.light,
    isCurrent: false,
  },
  {
    label: 'Тёмная',
    value: ThemeType.dark,
    isCurrent: false,
  },
  {
    label: 'Чёрная',
    value: ThemeType.black,
    isCurrent: false,
  },
];

const styles = StyleSheet.create({
  cardView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingTitle: {
    ...fontSize.medium,
  },
});

const ToggleThemeSetting = () => {
  const dispatch = useAppDispatch();
  const { events, theme: themeType } = useAppSelector((state) => state.settings.config);
  const modalRef = useRef<BottomSheetModal>();
  const theme = useAppTheme();

  const changeAppTheme = (selectedTheme: ThemeType) => {
    if (selectedTheme === ThemeType.newYear) {
      const $events = { ...events };
      $events.newYear2024 = {
        suggestedTheme: false,
        previousTheme: events.newYear2024.previousTheme,
      };
      dispatch(setEvents($events));
      cache.placeEvents($events);
    } else {
      dispatch(changeTheme(selectedTheme));
      cache.placeTheme(selectedTheme);
    }
  };

  return (
    <TouchableOpacity style={styles.cardView} onPress={() => modalRef.current.present()}>
      <Octicons name={'paintbrush'} size={22} color={theme.colors.text} />
      <Text style={styles.settingTitle}>Тема</Text>
      <Text style={[styles.settingTitle, { marginLeft: 'auto' }]}>
        {options.find((opt) => opt.value === themeType).label}
      </Text>

      <OptionsBottomSheet
        ref={modalRef}
        options={options}
        onOptionPress={changeAppTheme}
        currentOptionValue={themeType}
      />
    </TouchableOpacity>
  );
};

export default ToggleThemeSetting;
