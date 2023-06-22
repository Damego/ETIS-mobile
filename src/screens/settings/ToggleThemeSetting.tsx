import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Dropdown from '../../components/Dropdown';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { ThemeType, changeTheme } from '../../redux/reducers/settingsSlice';
import { storage } from '../../utils';

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
    label: 'Amoled',
    value: ThemeType.amoled,
  },
];

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
    storage.storeAppTheme(selectedTheme);
  };

  return (
    <View style={styles.cardView}>
      <Text style={{ fontSize: 18, fontWeight: '500', ...globalStyles.textColor }}>Тема</Text>
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