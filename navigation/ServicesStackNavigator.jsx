import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Services from '../screens/services';
import ShortTeachPlan from '../screens/shortTeachPlan';

const Stack = createNativeStackNavigator();

function ServicesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Сервисы" component={Services} />
      <Stack.Screen
        name="Учебный план"
        component={ShortTeachPlan}
      />
    </Stack.Navigator>
  );
}

export default ServicesStackNavigator;
