import notifee from '@notifee/react-native';
import * as Sentry from '@sentry/react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import weekday from 'dayjs/plugin/weekday';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'moment/locale/ru';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import StackNavigator from './navigation/StackNavigator';
import requestNotificationPermission from './notifications/permission';
import setupStore from './redux';
import { loadStorage } from './redux/storageLoader';
import { defineReminderTask } from './tasks/disciplineTasks';
import { defineSignsFetchTask } from './tasks/signs/signs';
import { checkUpdate } from './utils/inappUpdate';
import { addShortcuts } from './utils/shortcuts';

dayjs.extend(weekday);
SplashScreen.preventAutoHideAsync().catch((e) => e);

const store = setupStore();
store.dispatch(loadStorage());

defineSignsFetchTask();
defineReminderTask();
addShortcuts();

notifee.onBackgroundEvent(async (data) => {
  console.log(data);
});

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
