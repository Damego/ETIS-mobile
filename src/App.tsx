import 'dayjs/locale/ru';
import 'react-native-gesture-handler';
import './notifications/handler';

import * as Sentry from '@sentry/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import StackNavigator from './navigation/StackNavigator';
import requestNotificationPermission from './notifications/permission';
import { rescheduleAllTaskNotifications } from './notifications/taskReminder';
import setupStore from './redux';
import manageEventTheme from './redux/manageEventTheme';
import { loadStorage } from './redux/storageLoader';
import { defineSignsFetchTask } from './tasks/signs/signs';
import { checkUpdate } from './utils/inappUpdate';
import { addShortcuts } from './utils/shortcuts';

dayjs.locale('ru');
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

const store = setupStore();

// manageEventTheme читает theme/events из стейта, поэтому обязан
// выполняться после загрузки конфига из хранилища.
// Ошибка загрузки (битый кэш/хранилище) не должна оставаться
// unhandled rejection — логируем и продолжаем с дефолтным стейтом.
store.dispatch(loadStorage()).then(
  () => {
    store.dispatch(manageEventTheme(store));
  },
  (error) => {
    console.warn('loadStorage failed', error);
  },
);

defineSignsFetchTask();
addShortcuts();
rescheduleAllTaskNotifications();

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const App = () => {
  useEffect(() => {
    requestNotificationPermission();
    checkUpdate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    </QueryClientProvider>
  );
};

export default Sentry.wrap(App);
