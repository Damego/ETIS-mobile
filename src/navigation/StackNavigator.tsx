import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { cache } from '~/cache/smartCache';
import Background from '~/components/Background';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import useNotification from '~/hooks/useNotifications';
import EducationNavigation from '~/navigation/EducationNavigation';
import { headerParams } from '~/navigation/header';
import StartNavigator from '~/navigation/StartNavigator';
import TeacherNavigator from '~/navigation/TeacherNavigator';
import UnauthorizedStudentNavigator from '~/navigation/UnauthorizedStudentNavigator';
import { AccountType } from '~/redux/reducers/accountSlice';
import About from '~/screens/about/About';
import Intro from '~/screens/intro/Intro';
import ReleaseNotes from '~/screens/releaseNotes/ReleaseNotes';
import AppSettings from '~/screens/settings/AppSettings';
import ChangeAppUI from '~/screens/settings/uiSettings/ChangeAppUI';
import showPrivacyPolicy from '~/utils/privacyPolicy';
import InitSentry from '~/utils/sentry';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const { t } = useTranslation();
  const accountType = useAppSelector((state) => state.account.accountType);
  const {
    appIsReady,
    config: { introViewed, sentryEnabled },
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
    setBackgroundColorAsync(theme.colors.background).catch((e) => e);
  }, [theme]);

  useNotification(async (data) => {
    if (data.type === 'task-reminder') {
      // @ts-expect-error — вложенный навигационный параметр DisciplineTasks
      // не описан в типах таба; тело колбэка будет заменено в fix навигации
      // по уведомлениям (navigation в этом компоненте не существует)
      navigation.navigate('TabNavigator', { screen: 'DisciplineTasks', taskId: data.data.taskId });
    }
  });

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  let educationScreen = StartNavigator;
  if (accountType === AccountType.UNAUTHORIZED_TEACHER) {
    educationScreen = TeacherNavigator;
  } else if (accountType === AccountType.AUTHORIZED_STUDENT) {
    educationScreen = EducationNavigation;
  } else if (accountType === AccountType.UNAUTHORIZED_STUDENT) {
    educationScreen = UnauthorizedStudentNavigator;
  }

  return (
    <SafeAreaProvider>
      <Background theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer theme={{ ...DefaultTheme, ...theme }}>
            {/* introViewed приезжает из хранилища асинхронно (loadStorage);
                до готовности splash ещё не скрыт — не рендерим навигацию,
                чтобы у существующих пользователей не мигнул онбординг */}
            {appIsReady ? (
              <Stack.Navigator
                id={'root'}
                initialRouteName={introViewed ? 'TabNavigator' : 'Onboarding'}
                screenOptions={{ headerShown: true, ...headerParams(theme) }}
              >
                <Stack.Screen
                  name='TabNavigator'
                  component={educationScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='Onboarding'
                  component={Intro}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='AppSettings'
                  component={AppSettings}
                  options={{ title: t('navigation.appSettings') }}
                />
                <Stack.Screen
                  name='ChangeAppUI'
                  component={ChangeAppUI}
                  options={{ title: t('navigation.appInterface') }}
                />
                <Stack.Screen name='AboutApp' component={About} options={{ title: t('navigation.aboutApp') }} />
                <Stack.Screen
                  name='ReleaseNotes'
                  component={ReleaseNotes}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            ) : null}
          </NavigationContainer>
        </GestureHandlerRootView>
      </Background>
    </SafeAreaProvider>
  );
};

export default StackNavigator;
