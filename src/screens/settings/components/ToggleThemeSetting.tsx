import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cache } from '~/cache/smartCache';
import Text from '~/components/Text';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { changeTheme, setEvents } from '~/redux/reducers/settingsSlice';
import { ThemeType } from '~/styles/themes';
import { fontSize } from '~/utils/texts';

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

  return (
    <View style={styles.cardView}>
      <Text style={styles.settingTitle}>Тема</Text>
      {/*<View style={{ width: '60%' }}>*/}
      {/*  <Dropdown options={options} selectedOption={getCurrentTheme()} onSelect={changeAppTheme} />*/}
      {/*</View>*/}
    </View>
  );
};

export default ToggleThemeSetting;
