import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setBackgroundColorAsync as setBackgroundNavigationBarColorAsync } from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { useAppSelector } from '../hooks';
import { useAppTheme } from '../hooks/theme';
import AuthPage from '../screens/auth/Auth';
import Intro from '../screens/intro/Intro';
import MessageHistory from '../screens/messages/MessageHistory';
import { storage } from '../utils';
import showPrivacyPolicy from '../utils/privacyPolicy';
import TabNavigator from './TabNavigation';
import { headerParams } from './header';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { isSignedIn } = useAppSelector((state) => state.auth);
  const { viewedIntro, appIsReady } = useAppSelector((state) => state.settings);
  const theme = useAppTheme();

  setBackgroundNavigationBarColorAsync(theme.colors.card);

  useEffect(() => {
    const wrapper = async () => {
      if (!(await storage.hasAcceptedPrivacyPolicy())) {
        showPrivacyPolicy();
      }
    };
    wrapper();
  }, []);

  useEffect(() => {
    if (appIsReady) SplashScreen.hideAsync();
  }, [appIsReady]);

  let component;
  if (!viewedIntro) component = <Stack.Screen name="Onboarding" component={Intro} />;
  else if (!isSignedIn)
    component = (
      <Stack.Screen
        name="Auth"
        options={{ title: 'Авторизация', headerShown: true, ...headerParams(theme) }}
        component={AuthPage}
      />
    );
  else
    component = (
      <>
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen
          name="History"
          component={MessageHistory}
          options={{
            animation: 'none',
            headerShown: true,
            ...headerParams(theme),
          }}
        />
      </>
    );

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
