import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import StackNavigator from './navigation/StackNavigator';
import store from './redux';

const App = () => (
  <Provider store={store}>
    <StackNavigator />
  </Provider>
);

export default App;
