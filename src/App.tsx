import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import StackNavigator from './navigation/StackNavigator';
import './notifications/handler';
import requestNotificationPermission from './notifications/permission';
import { rescheduleAllTaskNotifications } from './notifications/taskReminder';
import setupStore from './redux';
import manageEventTheme from './redux/manageEventTheme';
import { loadStorage } from './redux/storageLoader';
import ETISScreen from './screens/etis/Etis';
import { defineSignsFetchTask } from './tasks/signs/signs';
import { checkUpdate } from './utils/inappUpdate';
import { addShortcuts } from './utils/shortcuts';

dayjs.locale('ru');
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
// SplashScreen.preventAutoHideAsync().catch((e) => e);
//
const store = setupStore();

store.dispatch(loadStorage());
store.dispatch(manageEventTheme(store));

// defineSignsFetchTask();
// addShortcuts();
// rescheduleAllTaskNotifications();

const App = () => {
  // useEffect(() => {
  //   requestNotificationPermission();
  //   checkUpdate();
  // }, []);
  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
};

export default Sentry.wrap(App);
