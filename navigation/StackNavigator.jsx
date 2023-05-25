import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';

import AuthPage from '../screens/auth/Auth';
import TabNavigator from './TabNavigation';
import {LightTheme, DarkTheme} from '../styles/themes';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../hooks';
import { ThemeType } from '../redux/reducers/settingsSlice';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const isSignedIn = useSelector(state => state.auth.isSignedIn )
  const themeNum = useAppSelector(state => state.settings.theme);

  let theme;
  if (themeNum === ThemeType.auto) {
    const scheme = useColorScheme();
    theme = scheme === 'dark' ? DarkTheme : LightTheme;
  } else {
    theme = ThemeType.light ? LightTheme : DarkTheme;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isSignedIn  ? (
          <Stack.Screen name="Authorization" component={AuthPage} />
        ) : (
          <Stack.Screen name="Navigator" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
