import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { setBackgroundColorAsync } from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAppColorScheme } from '../hooks/theme';
import AuthPage from '../screens/auth/Auth';
import Intro from '../screens/intro/Intro';
import { DarkTheme, LightTheme } from '../styles/themes';
import TabNavigator from './TabNavigation';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const scheme = useAppColorScheme();
  const theme = scheme === 'dark' ? DarkTheme : LightTheme;
  setBackgroundColorAsync(theme.colors.card)
  const [fontsLoaded] = useFonts({
    'Nunito-SemiBold': require('./../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('./../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Light': require('./../assets/fonts/Nunito-Light.ttf'),
    'Nunito-Regular': require('./../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  },[fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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