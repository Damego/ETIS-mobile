import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import MessageHistory from '../screens/messages/MessageHistory';
import Messages from '../screens/messages/Messages';

const Stack = createStackNavigator();

function MessageStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Сообщения" component={Messages} />
      <Stack.Screen name="История" component={MessageHistory} />
    </Stack.Navigator>
  );
}

export default MessageStackNavigator;
