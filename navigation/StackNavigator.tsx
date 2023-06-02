import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setBackgroundColorAsync } from 'expo-navigation-bar';
import React from 'react';
import { useSelector } from 'react-redux';

import { useAppColorScheme } from '../hooks/theme';
import AuthPage from '../screens/auth/Auth';
import Intro from '../screens/intro/Intro';
import { AmoledTheme, DarkTheme, LightTheme } from '../styles/themes';
import TabNavigator from './TabNavigation';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const scheme = useAppColorScheme();
  let theme;
  if (scheme === 'dark') {
    theme = DarkTheme;
  } else if (scheme === 'amoled' ){
    theme = AmoledTheme;
  }  else {
    theme = LightTheme;
  }
  setBackgroundColorAsync(theme.colors.card)

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isSignedIn ? (
          <Stack.Screen name="Authorization" component={AuthPage} />
        ) : (
          <Stack.Screen name="Navigator" component={TabNavigator} />
        )}
        <Stack.Screen name="Intro" component={Intro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;