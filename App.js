import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import StackNavigator from './navigation/StackNavigator';
import setupStore from './redux';
import { changeTheme } from './redux/reducers/settingsSlice';
import { storage } from './utils';

const store = setupStore();

const initDefaultTheme = () => {
  return dispatch => {
    storage.getAppTheme().then(theme => {dispatch(changeTheme(theme))})
  }
}

store.dispatch(initDefaultTheme())

const App = () => (
  <Provider store={store}>
    <StackNavigator />
  </Provider>
);

export default App;
