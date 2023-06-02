import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import StackNavigator from './navigation/StackNavigator';
import setupStore from './redux';
import { setUserCredentials } from './redux/reducers/authSlice';
import { changeTheme } from './redux/reducers/settingsSlice';
import { storage } from './utils';

const store = setupStore();

const loadTheme = () => {
  return (dispatch) => {
    storage.getAppTheme().then((theme) => {
      dispatch(changeTheme(theme));
    });
  };
};

const loadUserCredentials = () => {
  return (dispatch) => {
    storage.getAccountData().then((payload) => {
      dispatch(setUserCredentials(payload));
    });
  };
};

SplashScreen.preventAutoHideAsync();
store.dispatch(loadTheme());
store.dispatch(loadUserCredentials());

const App = () => {
  const [fontsLoaded] = useFonts({
    'Nunito-SemiBold': require('./assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Light': require('./assets/fonts/Nunito-Light.ttf'),
    'Nunito-Regular': require('./assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  },[fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
};

export default App;