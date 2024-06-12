import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setBackgroundColorAsync as setBackgroundNavigationBarColorAsync } from 'expo-navigation-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { cache } from '~/cache/smartCache';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import { headerParams } from '~/navigation/header';
import AppSettings from '~/screens/settings/AppSettings';
import showPrivacyPolicy from '~/utils/privacyPolicy';
import InitSentry from '~/utils/sentry';

import TabNavigator from './TabNavigation';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const {
    config: { sentryEnabled }, // todo: intro viewed new version
  } = useAppSelector((state) => state.settings);

  const theme = useAppTheme();

  const bumpPrivacyPolicy = async () => {
    if (!(await cache.hasAcceptedPrivacyPolicy())) {
      showPrivacyPolicy();
    }
  };

  useEffect(() => {
    bumpPrivacyPolicy();
    if (sentryEnabled) InitSentry();
  }, []);

  useEffect(() => {
    setBackgroundNavigationBarColorAsync(theme.colors.card).catch((e) => e);
    setBackgroundColorAsync(theme.colors.background).catch((e) => e);
  }, [theme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        <BottomSheetModalProvider>
          <Stack.Navigator screenOptions={{ headerShown: true, ...headerParams(theme) }}>
            <Stack.Screen
              name="TabNavigator"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AppSettings"
              component={AppSettings}
              options={{ title: 'Настройки' }}
            />
            <Stack.Screen
              name="ChangeAppTheme"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AboutApp"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ReleaseNotes"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default StackNavigator;

/*
  const isSignedIn = useAppSelector((state) => state.auth.isSignedIn);

*/
