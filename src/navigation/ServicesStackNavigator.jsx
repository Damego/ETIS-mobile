import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import About from '../screens/about/About';
import OrderTable from '../screens/orders';
import Services from '../screens/services';
import Settings from '../screens/settings/Settings';
import ShortTeachPlan from '../screens/shortTeachPlan';
import TeacherTable from '../screens/teachers';

const Stack = createNativeStackNavigator();

function ServicesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Сервисы" component={Services} />
      <Stack.Screen name="Учебный план" component={ShortTeachPlan} />
      <Stack.Screen name="Преподаватели" component={TeacherTable} />
      <Stack.Screen name="Приказы" component={OrderTable} />
      <Stack.Screen name="Настройки" component={Settings} />
      <Stack.Screen name="О приложении" component={About} />
    </Stack.Navigator>
  );
}

export default ServicesStackNavigator;