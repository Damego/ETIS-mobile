import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setBackgroundColorAsync as setBackgroundNavigationBarColorAsync } from 'expo-navigation-bar';
import React from 'react';

import { useAppSelector } from '../hooks';
import { useAppColorScheme } from '../hooks/theme';
import AuthPage from '../screens/auth/Auth';
import Intro from '../screens/intro/Intro';
import { AmoledTheme, DarkTheme, LightTheme } from '../styles/themes';
import TabNavigator from './TabNavigation';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { isSignedIn } = useAppSelector((state) => state.auth);
  const { viewedIntro } = useAppSelector((state) => state.settings);
  const scheme = useAppColorScheme();
  let theme;
  if (scheme === 'dark') {
    theme = DarkTheme;
  } else if (scheme === 'amoled') {
    theme = AmoledTheme;
  } else {
    theme = LightTheme;
  }
  setBackgroundNavigationBarColorAsync(theme.colors.card);

  let component;
  if (!viewedIntro) component = <Stack.Screen name="Intro" component={Intro} />;
  else if (!isSignedIn) component = <Stack.Screen name="Authorization" component={AuthPage} />;
  else component = <Stack.Screen name="Navigator" component={TabNavigator} />;

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {component}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
