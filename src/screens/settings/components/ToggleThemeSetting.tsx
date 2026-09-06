import { Octicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import BottomSheetModal from '~/components/BottomSheetModal';
import OptionsBottomSheet from '~/components/bottomSheets/OptionsBottomSheet';
import SettingRow from '~/components/SettingRow';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { persistEvents, persistTheme } from '~/redux/persistSettings';
import { ThemeType } from '~/styles/themes';
import { fontSize } from '~/utils/texts';

const ToggleThemeSetting = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { events, theme: themeType } = useAppSelector((state) => state.settings.config);
  const modalRef = useRef<BottomSheetModal | null>(null);
  const theme = useAppTheme();

  const themeLabels: Partial<Record<ThemeType, string>> = {
    [ThemeType.auto]: t('settings.themeAuto'),
    [ThemeType.light]: t('settings.themeLight'),
    [ThemeType.dark]: t('settings.themeDark'),
    [ThemeType.black]: t('settings.themeBlack'),
    [ThemeType.halloween]: t('settings.themeHalloween'),
    [ThemeType.newYear]: t('settings.themeNewYear'),
  };

  const options = (Object.entries(themeLabels) as Array<[ThemeType, string]>)
    .filter(([value]) => value !== ThemeType.halloween && value !== ThemeType.newYear)
    .map(([value, label]) => ({
      label,
      value,
      isCurrent: false,
    }));

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
        label={t('settings.theme')}
        icon={<Octicons name={'paintbrush'} size={24} color={theme.colors.text} />}
        onPress={() => modalRef.current?.present()}
        right={
          <Text style={fontSize.medium}>
            {themeLabels[themeType] ?? t('settings.themeAuto')}
          </Text>
        }
      />
      <OptionsBottomSheet
        ref={modalRef}
        options={options}
        onOptionPress={(value) => changeAppTheme(value as ThemeType)}
        currentOptionValue={themeType}
      />
    </>
  );
};

export default ToggleThemeSetting;
