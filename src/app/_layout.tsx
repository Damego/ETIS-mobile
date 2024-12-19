import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import { isRunningInExpoGo } from 'expo';
import { useFonts } from 'expo-font';
import { useNavigationContainerRef, useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { cache } from '~/cache/smartCache';
import ComposeChildren from '~/components/ComposeChildren';
import WebFontsLoader from '~/components/web/WebFontsLoader';
import { useAppSelector } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import ThemeProvider from '~/navigation/ThemeProvider';
import { headerParams } from '~/navigation/header';
import requestNotificationPermission from '~/notifications/permission';
import { rescheduleAllTaskNotifications } from '~/notifications/taskReminder';
import setupStore from '~/redux';
import manageEventTheme from '~/redux/manageEventTheme';
import { AccountType } from '~/redux/reducers/accountSlice';
import { loadStorage } from '~/redux/storageLoader';
import { defineSignsFetchTask } from '~/tasks/signs/signs';
import { checkUpdate } from '~/utils/inappUpdate';
import showPrivacyPolicy from '~/utils/privacyPolicy';
import InitSentry from '~/utils/sentry';

/*
To finalize the installation of react-native-gesture-handler, we need to conditionally import it. To do this, create 2 files:

gesture-handler.native.js
// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';

gesture-handler.js
// Don't import react-native-gesture-handler on web

Now, add the following at the top (make sure it's at the top and there's nothing else before it) of your entry file, such as index.js or App.js:

import './gesture-handler';
*/

dayjs.locale('ru');
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

defineSignsFetchTask();
rescheduleAllTaskNotifications();

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});
InitSentry(navigationIntegration);

const queryClient = new QueryClient();
const store = setupStore();

store.dispatch(loadStorage());
store.dispatch(manageEventTheme(store));

const RootLayout = () => {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestNotificationPermission();
      checkUpdate();
    }
    bumpPrivacyPolicy();
  }, []);

  const bumpPrivacyPolicy = async () => {
    if (!(await cache.hasAcceptedPrivacyPolicy())) {
      showPrivacyPolicy();
    }
  };

  return (
    <ComposeChildren>
      {Platform.OS === 'web' && <WebFontsLoader />}
      <QueryClientProvider client={queryClient} />
      <Provider store={store} />
      <GestureHandlerRootView style={{ flex: 1 }} />
      <BottomSheetModalProvider />
      <ThemeProvider />
      <RootNav />
    </ComposeChildren>
  );
};

export default Sentry.wrap(RootLayout);

const RootNav = () => {
  const theme = useAppTheme();
  const navigation = useNavigationContainerRef();
  const accountType = useAppSelector((state) => state.account.accountType);

  useEffect(() => {
    if (accountType === AccountType.UNAUTHORIZED_TEACHER) {
      navigation.reset({
        index: 0,
        routes: [{ name: '(teacher)' }],
      });
    } else if (accountType === AccountType.UNAUTHORIZED_STUDENT) {
      navigation.reset({
        index: 0,
        routes: [{ name: '(group)' }],
      });
    } else if (accountType === AccountType.AUTHORIZED_STUDENT) {
      navigation.reset({
        index: 0,
        routes: [{ name: '(education)' }],
      });
    }
  }, []);

  return (
    <Stack initialRouteName="(start)" screenOptions={{ ...headerParams(theme) }}>
      <Stack.Screen name="(start)" options={{ headerShown: false }} />
      <Stack.Screen name="(settings)" options={{ title: 'Настройки' }} />
      <Stack.Screen name="(releaseNotes)" options={{ headerShown: false }} />
      <Stack.Screen name="(teacher)" options={{ headerShown: false }} />
      <Stack.Screen name="(about)" options={{ title: 'О приложении' }} />
      <Stack.Screen name="(shared)" options={{ headerShown: false }} />
      <Stack.Screen name="(education)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ title: 'Вход' }} />
    </Stack>
  );
};
