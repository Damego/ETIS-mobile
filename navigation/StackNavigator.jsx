import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';

import AuthPage from '../screens/auth/Auth';
import TabNavigator from './TabNavigation';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8F8FA',
    primary: '#C62E3E',
    border: '#EAEAEA'
  },
};

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const isSignedIn = useSelector(state => state.auth.isSignedIn )

  return (
    <NavigationContainer theme={LightTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isSignedIn  ? (
          <Stack.Screen name="Authorization" component={AuthPage} />
        ) : (
          <Stack.Screen name="Navigator" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
