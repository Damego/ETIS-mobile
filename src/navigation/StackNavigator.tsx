import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setBackgroundColorAsync as setBackgroundNavigationBarColorAsync } from 'expo-navigation-bar';
import * as QuickActions from 'expo-quick-actions';
import * as SplashScreen from 'expo-splash-screen';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { cache } from '../cache/smartCache';
import Background from '../components/Background';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAppTheme } from '../hooks/theme';
import { PageType, changeTheme, setEvents, setInitialPage } from '../redux/reducers/settingsSlice';
import AuthPage from '../screens/auth/Auth';
import DisciplineInfo from '../screens/disciplineInfo/DisciplineInfo';
import Intro from '../screens/intro/Intro';
import MessageHistory from '../screens/messages/MessageHistory';
import NewYearThemes from '../screens/newYearThemes/NewYearThemes';
import SessionQuestionnaire from '../screens/sessionQuestionnaire/SessionQuestionnaire';
import SignsDetails from '../screens/signs/SignsDetails';
import { ThemeType, isNewYearTheme } from '../styles/themes';
import { isHalloween, isNewYear } from '../utils/events';
import showPrivacyPolicy from '../utils/privacyPolicy';
import InitSentry from '../utils/sentry';
import TabNavigator from './TabNavigation';
import { headerParams } from './header';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const isSignedIn = useAppSelector((state) => state.auth.isSignedIn);
  const {
    viewedIntro,
    appIsReady,
    sentryEnabled,
    theme: themeType,
    events,
  } = useAppSelector((state) => state.settings);

  const theme = useAppTheme();
  const dispatch = useAppDispatch();

  const dispatchInitialPage = async () => {
    try {
      const data = QuickActions.initial;
      if (data?.id) {
        dispatch(setInitialPage(data.id as PageType));
      }
    } catch (e) {
      // ignore
    }
  };

  const bumpPrivacyPolicy = async () => {
    if (!(await cache.hasAcceptedPrivacyPolicy())) {
      showPrivacyPolicy();
    }
  };

  const checkHalloweenEvent = async () => {
    const $events = { ...events };
    const $isHalloween = isHalloween();

    if ($isHalloween && !$events.halloween2023?.suggestedTheme) {
      $events.halloween2023 = {
        suggestedTheme: true,
        previousTheme: themeType,
      };
      dispatch(changeTheme(ThemeType.halloween));
      cache.placeTheme(ThemeType.halloween);
      dispatch(setEvents($events));
      cache.placeEvents($events);
    }
    if (!$isHalloween && themeType === ThemeType.halloween) {
      if (!$events.halloween2023) {
        dispatch(changeTheme(ThemeType.auto));
        cache.placeTheme(ThemeType.auto);
      } else {
        dispatch(changeTheme($events.halloween2023.previousTheme));
        cache.placeTheme($events.halloween2023.previousTheme);
      }
    }
  };

  const $isNewYear = useMemo(() => isNewYear(), []);
  const checkNewYearEvent = () => {
    if (!$isNewYear && isNewYearTheme(themeType)) {
      let returnTheme: ThemeType;

      if (!events.newYear2024?.previousTheme || isNewYearTheme(events.newYear2024.previousTheme))
        returnTheme = ThemeType.auto;
      else returnTheme = events.newYear2024.previousTheme;

      dispatch(changeTheme(returnTheme));
      cache.placeTheme(returnTheme);
    }
  };

  const checkEventTheme = async () => {
    await checkHalloweenEvent();
    checkNewYearEvent();
  };

  useEffect(() => {
    checkEventTheme();
    bumpPrivacyPolicy();
    if (sentryEnabled) InitSentry();
    dispatchInitialPage();
  }, []);

  useEffect(() => {
    setBackgroundNavigationBarColorAsync(theme.colors.card).catch((e) => e);
    setBackgroundColorAsync(theme.colors.background).catch((e) => e);
  }, [theme]);

  useEffect(() => {
    if (appIsReady) SplashScreen.hideAsync().catch((e) => e /* huh? */);
  }, [appIsReady]);

  let component: React.ReactNode;
  if (!viewedIntro) component = <Stack.Screen name="Onboarding" component={Intro} />;
  else if ($isNewYear && !events?.newYear2024?.suggestedTheme)
    component = <Stack.Screen name={'NewYearTheme'} component={NewYearThemes} />;
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
          name="SignsDetails"
          component={SignsDetails}
          options={{ title: 'Подробности', headerShown: true, ...headerParams(theme) }}
        />
        <Stack.Screen
          name={'SessionQuestionnaire'}
          component={SessionQuestionnaire}
          options={{ title: 'Анкетирование', headerShown: true, ...headerParams(theme) }}
        />
      </>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Background theme={theme}>
        <NavigationContainer theme={theme}>
          <BottomSheetModalProvider>
            <Stack.Navigator>
              <Stack.Group
                screenOptions={{
                  headerShown: false,
                }}
              >
                {component}
              </Stack.Group>
              <Stack.Group
                screenOptions={{
                  presentation: 'modal',
                  headerShown: true,
                  ...headerParams(theme),
                }}
              >
                <Stack.Screen
                  name={'DisciplineInfo'}
                  options={{ title: 'Информация' }}
                  component={DisciplineInfo}
                />
              </Stack.Group>
            </Stack.Navigator>
          </BottomSheetModalProvider>
        </NavigationContainer>
      </Background>
    </GestureHandlerRootView>
  );
};

export default StackNavigator;
