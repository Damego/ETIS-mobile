import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cache } from '../../cache/smartCache';
import Dropdown from '../../components/Dropdown';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { changeTheme } from '../../redux/reducers/settingsSlice';
import { ThemeType } from '../../styles/themes';
import { isHalloween } from '../../utils/events';
import { fontSize } from '../../utils/texts';

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
  {
    label: 'Зимняя',
    value: ThemeType.winter
  }
];

if (isHalloween())
  options.push({
    label: 'Хэллоуин',
    value: ThemeType.halloween,
  });

const styles = StyleSheet.create({
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const ToggleThemeSetting = () => {
  const dispatch = useAppDispatch();
  const themeType = useAppSelector((state) => state.settings.theme);
  const globalStyles = useGlobalStyles();

  const changeAppTheme = (selectedTheme: ThemeType) => {
    dispatch(changeTheme(selectedTheme));
    cache.placeTheme(selectedTheme);
  };

  return (
    <View style={styles.cardView}>
      <Text style={{ ...fontSize.medium, fontWeight: '500', ...globalStyles.textColor }}>Тема</Text>
      <View
        style={{
          width: '60%',
        }}
      >
        <Dropdown
          options={options}
          selectedOption={options.find((option) => option.value === themeType)}
          onSelect={changeAppTheme}
        />
      </View>
    </View>
  );
};

export default ToggleThemeSetting;
