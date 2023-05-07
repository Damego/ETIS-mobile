import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';

import ShortTeachPlan from '../screens/shortTeachPlan/shortTeachPlan';
import Signs from '../screens/signs/Signs';
import TimeTablePage from '../screens/timeTable/TimeTable';
import Announce from '../screens/announce/Announce';

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
        tabBarIcon: ({ size, color }) => <FontAwesome name="list-alt" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Оценки"
      component={Signs}
      options={{
        tabBarIcon: ({ size, color }) => <MaterialIcons name="grade" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Объявления"
      component={Announce}
      options={{
        tabBarIcon: ({ size, color }) => <MaterialIcons name="grade" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;
