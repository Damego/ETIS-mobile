import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';

import { useAppColorScheme } from '../hooks/theme';
import AuthScreen from '../screens/auth/Auth';
import { DarkTheme, LightTheme } from '../styles/themes';
import TabNavigator from './TabNavigation';
import { setBackgroundColorAsync } from 'expo-navigation-bar';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const scheme = useAppColorScheme();
  const theme = scheme === 'dark' ? DarkTheme : LightTheme;
  setBackgroundColorAsync(theme.colors.card)

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isSignedIn ? (
          <Stack.Screen name="Авторизация" component={AuthScreen} />
        ) : (
          <Stack.Screen name="Navigator" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
