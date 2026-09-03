import { Octicons } from '@expo/vector-icons';
import React, { useRef } from 'react';

import BottomSheetModal from '~/components/BottomSheetModal';
import OptionsBottomSheet from '~/components/bottomSheets/OptionsBottomSheet';
import SettingRow from '~/components/SettingRow';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { persistEvents, persistTheme } from '~/redux/persistSettings';
import { ThemeType } from '~/styles/themes';
import { fontSize } from '~/utils/texts';

const themeLabels: Partial<Record<ThemeType, string>> = {
  [ThemeType.auto]: 'Автоматическая',
  [ThemeType.light]: 'Светлая',
  [ThemeType.dark]: 'Тёмная',
  [ThemeType.black]: 'Чёрная',
  [ThemeType.halloween]: 'Хэллоуин',
  [ThemeType.newYear]: 'Новый год',
};

const options = (Object.entries(themeLabels) as Array<[ThemeType, string]>)
  .filter(([value]) => value !== ThemeType.halloween && value !== ThemeType.newYear)
  .map(([value, label]) => ({
    label,
    value,
    isCurrent: false,
  }));

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
        previousTheme: events.newYear?.previousTheme ?? ThemeType.auto,
      };
      persistEvents(dispatch, $events);
    } else {
      persistTheme(dispatch, selectedTheme);
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
            {themeLabels[themeType] ?? 'Автоматическая'}
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
