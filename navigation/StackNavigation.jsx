import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthPage from '../screens/auth/Auth';
import AuthContext from '../context/AuthContext';
import TabNavigator from './TabNavigation';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const [isSignIn, setSignIn] = useState(false);

  const toggleSignIn = () => {
    setSignIn(!isSignIn);
  }

  return (
    <AuthContext.Provider value={{toggleSignIn}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: '#F8F8Fa',
            },
          }}
        >
          {!isSignIn ? (
            <Stack.Screen
              name="Authorization"
              options={{ headerShown: false }}
              component={AuthPage}
            />
          ) : (
            <Stack.Screen
              name="Navigator"
              options={{ headerShown: false }}
              component={TabNavigator}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default StackNavigator;
