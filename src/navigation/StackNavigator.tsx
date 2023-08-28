import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setBackgroundColorAsync as setBackgroundNavigationBarColorAsync } from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import QuickActions from 'react-native-quick-actions';

import { cache } from '../cache/smartCache';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAppTheme } from '../hooks/theme';
import { PageType, setInitialPage } from '../redux/reducers/settingsSlice';
import AuthPage from '../screens/auth/Auth';
import Intro from '../screens/intro/Intro';
import MessageHistory from '../screens/messages/MessageHistory';
import SessionQuestionnaire from '../screens/sessionQuestionnaire/SessionQuestionnaire';
import CalendarSchedule from '../screens/shortTeachPlan/CalendarSchedule';
import showPrivacyPolicy from '../utils/privacyPolicy';
import InitSentry from '../utils/sentry';
import TabNavigator from './TabNavigation';
import { headerParams } from './header';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { isSignedIn } = useAppSelector((state) => state.auth);
  const { viewedIntro, appIsReady } = useAppSelector((state) => state.settings);
  const theme = useAppTheme();
  const dispatch = useAppDispatch();

  const dispatchInitialPage = async () => {
    try {
      const data = await QuickActions.popInitialAction();
      if (data?.type) {
        if (data.type === 'debug') {
          InitSentry();
        } else {
          dispatch(setInitialPage(data.type as PageType));
        }
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const wrapper = async () => {
      if (!(await cache.hasAcceptedPrivacyPolicy())) {
        showPrivacyPolicy();
      }
    };

    wrapper();
    dispatchInitialPage();
  }, []);

  useEffect(() => {
    setBackgroundNavigationBarColorAsync(theme.colors.card);
    setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

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
        <Stack.Screen
          name={'SessionQuestionnaire'}
          component={SessionQuestionnaire}
          options={{ title: 'Анкетирование', headerShown: true, ...headerParams(theme) }}
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
        <Stack.Group>{component}</Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name={'calendarSchedule'}
            component={CalendarSchedule}
            options={{ title: 'График' }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
