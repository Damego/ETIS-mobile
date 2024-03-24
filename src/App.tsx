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
import { invalidateOutdatedTaskNotifications } from './notifications/taskReminder';
import setupStore from './redux';
import { loadStorage } from './redux/storageLoader';
import { defineSignsFetchTask } from './tasks/signs/signs';
import { checkUpdate } from './utils/inappUpdate';
import { addShortcuts } from './utils/shortcuts';

dayjs.locale('ru');
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
SplashScreen.preventAutoHideAsync().catch((e) => e);

const store = setupStore();
store.dispatch(loadStorage());

defineSignsFetchTask();
addShortcuts();
invalidateOutdatedTaskNotifications();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Nunito-SemiBold': require('../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Light': require('../assets/fonts/Nunito-Light.ttf'),
    'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    requestNotificationPermission();
    checkUpdate();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
};

export default Sentry.wrap(App);
