import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState, useRef } from 'react';

import AuthContext from '../context/AuthContext';
import AuthPage from '../screens/auth/Auth';
import TabNavigator from './TabNavigation';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F8F8Fa',
  },
};

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const showLoading = useRef(false);
  const [isSignIn, setSignIn] = useState(false);

  const toggleSignIn = (asReAuth) => {
    setSignIn(!isSignIn);
    showLoading.current = asReAuth;
  };

  return (
    <AuthContext.Provider value={{ toggleSignIn, showLoading: showLoading.current }}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isSignIn ? (
            <Stack.Screen name="Authorization" component={AuthPage} />
          ) : (
            <Stack.Screen name="Navigator" component={TabNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default StackNavigator;
