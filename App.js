import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import StackNavigator from './navigation/StackNavigator';
import setupStore from './redux';

const store = setupStore()

const App = () => (
  <Provider store={store}>
    <StackNavigator />
  </Provider>
);

export default App;
