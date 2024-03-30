import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setBackgroundColorAsync as setBackgroundNavigationBarColorAsync } from 'expo-navigation-bar';
import * as QuickActions from 'expo-quick-actions';
import * as SplashScreen from 'expo-splash-screen';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { cache } from '../cache/smartCache';
import Background from '../components/Background';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAppTheme } from '../hooks/theme';
import { PageType, setInitialPage } from '../redux/reducers/settingsSlice';
import AuthPage from '../screens/auth/Auth';
import BellSchedule from '../screens/bellSchedule/BellSchedule';
import CertificateIncome from '../screens/certificate/CertificateIncome';
import DisciplineInfo from '../screens/disciplineInfo/DisciplineInfo';
import DisciplinesTasks from '../screens/disciplinesTasks/DisciplinesTasks';
import Intro from '../screens/intro/Intro';
import MessageHistory from '../screens/messages/MessageHistory';
import NewYearThemes from '../screens/newYearThemes/NewYearThemes';
import SessionQuestionnaire from '../screens/sessionQuestionnaire/SessionQuestionnaire';
import SignsDetails from '../screens/signs/SignsDetails';
import { isNewYear } from '../utils/events';
import showPrivacyPolicy from '../utils/privacyPolicy';
import InitSentry from '../utils/sentry';
import TabNavigator from './TabNavigation';
import { headerParams } from './header';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const isSignedIn = useAppSelector((state) => state.auth.isSignedIn);
  const {
    config: { introViewed, sentryEnabled, events },
    appIsReady,
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

  useEffect(() => {
    bumpPrivacyPolicy();
    if (sentryEnabled) InitSentry();
    dispatchInitialPage();
  }, []);

  useEffect(() => {
    setBackgroundNavigationBarColorAsync(theme.colors.card).catch((e) => e);
    setBackgroundColorAsync(theme.colors.background).catch((e) => e);
  }, [theme]);

  useEffect(() => {
    if (appIsReady) SplashScreen.hideAsync().catch((e) => e);
  }, [appIsReady]);

  let initialRouteName: keyof RootStackParamList = 'TabNavigator';
  if (!introViewed) initialRouteName = 'Onboarding';
  else if (isNewYear() && !events?.newYear2024?.suggestedTheme) initialRouteName = 'NewYearTheme';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Background theme={theme}>
        <NavigationContainer theme={theme}>
          <BottomSheetModalProvider>
            <Stack.Navigator initialRouteName={!isSignedIn ? initialRouteName : undefined}>
              <Stack.Group screenOptions={{ headerShown: true, ...headerParams(theme) }}>
                {!isSignedIn ? (
                  <Stack.Screen
                    name="Auth"
                    options={{ title: 'Авторизация' }}
                    component={AuthPage}
                  />
                ) : (
                  <>
                    <Stack.Screen
                      name="History"
                      component={MessageHistory}
                      options={{ animation: 'none' }}
                    />
                    <Stack.Screen
                      name="SignsDetails"
                      component={SignsDetails}
                      options={{ title: 'Подробности' }}
                    />
                    <Stack.Screen
                      name="CertificateIncome"
                      component={CertificateIncome}
                      options={{ title: 'Справка о доходах' }}
                    />
                    <Stack.Screen
                      name={'SessionQuestionnaire'}
                      component={SessionQuestionnaire}
                      options={{ title: 'Анкетирование' }}
                    />
                    <Stack.Screen
                      name={'DisciplineInfo'}
                      options={{ title: 'Информация' }}
                      component={DisciplineInfo}
                    />
                    <Stack.Screen
                      name={'DisciplineTasks'}
                      options={{ title: 'Задания' }}
                      component={DisciplinesTasks}
                    />
                    <Stack.Screen
                      name={'BellSchedule'}
                      component={BellSchedule}
                      options={{ title: 'Расписание звонков' }}
                    />
                  </>
                )}
              </Stack.Group>
              <Stack.Group screenOptions={{ headerShown: false }}>
                <Stack.Screen name="TabNavigator" component={TabNavigator} />
                <Stack.Screen name="NewYearTheme" component={NewYearThemes} />
                <Stack.Screen name="Onboarding" component={Intro} />
              </Stack.Group>
            </Stack.Navigator>
          </BottomSheetModalProvider>
        </NavigationContainer>
      </Background>
    </GestureHandlerRootView>
  );
};

export default StackNavigator;
