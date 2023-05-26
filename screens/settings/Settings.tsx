import React from 'react';
import { Text, View } from 'react-native';

import Card from '../../components/Card';
import Dropdown from '../../components/Dropdown';
import Screen from '../../components/Screen';
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
];

const ToggleThemeSetting = () => {
  const dispatch = useAppDispatch();
  const themeType = useAppSelector((state) => state.settings.theme);
  const globalStyles = useGlobalStyles();

  const changeAppTheme = (selectedTheme: ThemeType) => {
    dispatch(changeTheme(selectedTheme));
    storage.storeAppTheme(selectedTheme);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{flex: 2}}>
        <Text style={{ fontSize: 20, fontWeight: '500', ...globalStyles.textColor }}>Тема</Text>
      </View>
      <Dropdown
        options={options}
        selectedOption={options.find((option) => option.value === themeType)}
        onSelect={changeAppTheme}
      />
    </View>
  );
};

export default function Settings() {
  return (
    <Screen headerText="Настройки" disableRefresh>
      <Card>
        <ToggleThemeSetting />
      </Card>
    </Screen>
  );
}
