import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import MessageBlock from '../screens/messages/MessageBlock';
import MessageHistory from '../screens/messages/MessageHistory';

const Stack = createStackNavigator();

function MessageStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Сообщения" component={MessageHistory} />
      <Stack.Screen name="Блок сообщений" component={MessageBlock} />
    </Stack.Navigator>
  );
}

export default MessageStackNavigator;
