import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import Card from '../../components/Card';
import Dropdown from '../../components/Dropdown';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../../hooks';
import { ThemeType, changeTheme, setSignNotification } from '../../redux/reducers/settingsSlice';
import { unregisterBackgroundFetchAsync } from '../../tasks/signs';
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
  header: { fontSize: 20, fontWeight: '500' },
});

const ToggleSignNotification = () => {
  const dispatch = useAppDispatch();
  const signNotification = useAppSelector((state) => state.settings.signNotification);
  const globalStyles = useGlobalStyles();
  const changeSignNotification = (signNotification: boolean) => {
    unregisterBackgroundFetchAsync();
    dispatch(setSignNotification(signNotification));
    storage.storeSignNotification(signNotification);
  };

  return (
    <View style={styles.cardView}>
      <Text style={[styles.header, { fontSize: 18, ...globalStyles.textColor }]}>
        Проверять новые оценки?
      </Text>
      <Switch
        trackColor={{ false: 'gray', true: 'teal' }}
        thumbColor="white"
        onValueChange={(value) => changeSignNotification(value)}
        value={signNotification}
      />
    </View>
  );
};

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
      <Text style={[styles.header, { ...globalStyles.textColor }]}>Тема</Text>
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

export default function Settings() {
  return (
    <Screen disableRefresh>
      <Card style={{ zIndex: 1 }}>
        <ToggleThemeSetting />
      </Card>
      <Card>
        <ToggleSignNotification />
      </Card>
    </Screen>
  );
}
