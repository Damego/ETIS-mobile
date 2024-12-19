import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setBackgroundColorAsync as setBackgroundNavigationBarColorAsync } from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { setBackgroundColorAsync } from 'expo-system-ui';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { cache } from '~/cache/smartCache';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import useNotification from '~/hooks/useNotifications';
import EducationNavigation from '~/navigation/EducationNavigation';
import StartNavigator from '~/navigation/StartNavigator';
import TeacherNavigator from '~/navigation/TeacherNavigator';
import UnauthorizedStudentNavigator from '~/navigation/UnauthorizedStudentNavigator';
import { headerParams } from '~/navigation/header';
import { AccountType } from '~/redux/reducers/accountSlice';
import About from '~/screens/about/About';
import ReleaseNotes from '~/screens/releaseNotes/ReleaseNotes';
import AppSettings from '~/screens/settings/AppSettings';
import ChangeAppUI from '~/screens/settings/uiSettings/ChangeAppUI';
import showPrivacyPolicy from '~/utils/privacyPolicy';
import InitSentry from '~/utils/sentry';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const accountType = useAppSelector((state) => state.account.accountType);
  const {
    appIsReady,
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

  useNotification(async (data) => {
    if (data.type === 'task-reminder') {
      // @ts-expect-error: TS2345
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

  if (!appIsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={theme}>
        <BottomSheetModalProvider>
          <Stack.Navigator screenOptions={{ headerShown: true, ...headerParams(theme) }}>
            <Stack.Screen
              name="TabNavigator"
              component={educationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AppSettings"
              component={AppSettings}
              options={{ title: 'Настройки' }}
            />
            <Stack.Screen
              name="ChangeAppUI"
              component={ChangeAppUI}
              options={{ title: 'Интерфейс' }}
            />
            <Stack.Screen name="AboutApp" component={About} options={{ title: 'О приложении' }} />
            <Stack.Screen
              name="ReleaseNotes"
              component={ReleaseNotes}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default StackNavigator;
