import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
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

const App = () => (
  <Provider store={store}>
    <StackNavigator />
  </Provider>
);

export default App;