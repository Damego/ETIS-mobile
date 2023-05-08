import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import ShortTeachPlan from '../screens/shortTeachPlan';
import Signs from '../screens/signs';
import TimeTablePage from '../screens/timeTable';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#CE2539',
      tabBarShowLabel: false
    }}
  >
    <Tab.Screen
      name="Расписание"
      component={TimeTablePage}
      options={{
        tabBarIcon: ({ size, color }) => <AntDesign name="calendar" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Учебный план"
      component={ShortTeachPlan}
      options={{
        tabBarIcon: ({ size, color }) => <AntDesign name="profile" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Оценки"
      component={Signs}
      options={{
        tabBarIcon: ({ size, color }) => <AntDesign name="barschart" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;
