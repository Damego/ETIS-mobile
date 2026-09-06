import 'dayjs/locale/ru';
import 'react-native-gesture-handler';
import './notifications/handler';
import './i18n';

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
import logger from './utils/logger';
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
    logger.warn('loadStorage failed', error);
  },
);

defineSignsFetchTask();
addShortcuts();
rescheduleAllTaskNotifications();

// Дефолты для React Query (используется в ~10 экранах поверх собственного useQuery).
// staleTime: 5 минут — данные считаются свежими и не рефетечатся при маунте/фокусе;
// retry: 1 — одна повторная попытка вместо трёх по умолчанию (портал и так часто лежит,
// длинные ретраи лишь затягивают экран состояния ошибки).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

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
