import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'moment/locale/ru';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import StackNavigator from './navigation/StackNavigator';
import setupStore from './redux';
import { loadStorage } from './redux/storageLoader';
import { defineFetchTask } from './tasks/signs';
import { checkUpdate } from './utils/inappUpdate';
import { registerForPushNotificationsAsync, setNotificationHandler } from './utils/notifications';
import { addShortcuts } from './utils/shortcuts';

SplashScreen.preventAutoHideAsync();

const store = setupStore();
store.dispatch(loadStorage());

defineFetchTask();
setNotificationHandler();
addShortcuts();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Nunito-SemiBold': require('../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Light': require('../assets/fonts/Nunito-Light.ttf'),
    'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
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
