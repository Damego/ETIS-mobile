import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthPage from '../screens/auth/Auth';

import TabNavigator from './TabNavigation';

const Stack = createNativeStackNavigator();

const StackNavigator = ({ isSignedIn, setSignedIn }) => {
  console.log('is signed in ', isSignedIn);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        >
          {!isSignedIn ? (
            <Stack.Screen
              name="Authorization"
              options={{ headerShown: false }}
              screenOptions={{
                contentStyle: {
                  backgroundColor: '#FFFFFF',
                },
              }}
            >
              <AuthPage
                onSignIn={() => {
                  setSignedIn(true);
                }}
              />
            </Stack.Screen>
          ) : (
            <Stack.Screen
              name="Navigator"
              options={{ headerShown: false }}
              screenOptions={{
                contentStyle: {
                  backgroundColor: '#FFFFFF',
                },
              }}
            >
              <TabNavigator />
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default StackNavigator;
