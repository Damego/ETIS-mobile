import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';

import AuthPage from '../screens/auth/Auth';
import TabNavigator from './TabNavigation';
import {LightTheme, DarkTheme} from '../styles/themes';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const isSignedIn = useSelector(state => state.auth.isSignedIn )
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : LightTheme}>
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
