import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import MessageBlock from '../screens/messages/MessageBlock';
import MessageHistory from '../screens/messages/MessageHistory';

const Stack = createNativeStackNavigator();

function MessageStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Все сообщения" component={MessageHistory} />
      <Stack.Screen name="Блок сообщений" component={MessageBlock} />
    </Stack.Navigator>
  );
}

export default MessageStackNavigator;
