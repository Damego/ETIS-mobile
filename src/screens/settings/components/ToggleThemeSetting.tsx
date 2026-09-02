import { Octicons } from '@expo/vector-icons';
import React, { useRef } from 'react';

import { cache } from '~/cache/smartCache';
import BottomSheetModal from '~/components/BottomSheetModal';
import OptionsBottomSheet from '~/components/bottomSheets/OptionsBottomSheet';
import SettingRow from '~/components/SettingRow';
import Text from '~/components/Text';
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

const ToggleThemeSetting = () => {
  const dispatch = useAppDispatch();
  const { events, theme: themeType } = useAppSelector((state) => state.settings.config);
  const modalRef = useRef<BottomSheetModal | undefined>(undefined);
  const theme = useAppTheme();

  const changeAppTheme = (selectedTheme: ThemeType) => {
    if (selectedTheme === ThemeType.newYear) {
      const $events = { ...events };
      $events.newYear = {
        suggestedTheme: false,
        previousTheme: events.newYear.previousTheme,
      };
      dispatch(setEvents($events));
      cache.placeEvents($events);
    } else {
      dispatch(changeTheme(selectedTheme));
      cache.placeTheme(selectedTheme);
    }
  };

  return (
    <>
      <SettingRow
        label='Тема'
        icon={<Octicons name={'paintbrush'} size={24} color={theme.colors.text} />}
        onPress={() => modalRef.current.present()}
        right={
          <Text style={fontSize.medium}>
            {options.find((opt) => opt.value === themeType).label}
          </Text>
        }
      />
      <OptionsBottomSheet
        ref={modalRef}
        options={options}
        onOptionPress={changeAppTheme}
        currentOptionValue={themeType}
      />
    </>
  );
};

export default ToggleThemeSetting;
