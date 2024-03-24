import React from 'react';
import { StyleSheet, View } from 'react-native';

import { cache } from '../../../cache/smartCache';
import Dropdown from '../../../components/Dropdown';
import Text from '../../../components/Text';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { changeTheme, setEvents } from '../../../redux/reducers/settingsSlice';
import { ThemeType, isNewYearTheme } from '../../../styles/themes';
import { isHalloween, isNewYear } from '../../../utils/events';
import { fontSize } from '../../../utils/texts';

const options = [
  {
    label: 'Автоматическая',
    value: ThemeType.auto,
  },
  {
    label: 'Светлая',
    value: ThemeType.light,
  },
  {
    label: 'Тёмная',
    value: ThemeType.dark,
  },
  {
    label: 'Чёрная',
    value: ThemeType.black,
  },
];

if (isHalloween())
  options.push({
    label: 'Хэллоуин',
    value: ThemeType.halloween,
  });

if (isNewYear())
  options.push({
    label: 'Новогодняя',
    value: ThemeType.newYear,
  });

const styles = StyleSheet.create({
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    ...fontSize.medium,
    fontWeight: '500',
  },
});

const ToggleThemeSetting = () => {
  const dispatch = useAppDispatch();
  const { events, theme: themeType } = useAppSelector((state) => state.settings.config);

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

  const getCurrentTheme = () => {
    const $themeType = isNewYearTheme(themeType) ? ThemeType.newYear : themeType;
    return options.find((option) => option.value === $themeType);
  };

  return (
    <View style={styles.cardView}>
      <Text style={styles.settingTitle} colorVariant={'block'}>
        Тема
      </Text>
      <View style={{ width: '60%' }}>
        <Dropdown options={options} selectedOption={getCurrentTheme()} onSelect={changeAppTheme} />
      </View>
    </View>
  );
};

export default ToggleThemeSetting;
