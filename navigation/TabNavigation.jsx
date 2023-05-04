import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text } from 'react-native';

import ShortTeachPlan from '../screens/shortTeachPlan/shortTeachPlan';
import Signs from '../screens/signs/Signs';
import TimeTablePage from '../screens/timeTable/TimeTable';
import { GLOBAL_STYLES } from '../styles/styles';

const Tab = createBottomTabNavigator();

const renderOptionTitle = (text) => () => <Text style={GLOBAL_STYLES.textIcon}>{text}</Text>;

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Расписание"
      component={TimeTablePage}
      options={{
        headerShown: false,
        tabBarLabel: renderOptionTitle('Расписание'),
        tabBarIcon: ({ size, color }) => <AntDesign name="calendar" size={size} color={color} />,
        tabBarActiveTintColor: '#CE2539',
      }}
    />
    <Tab.Screen
      name="Учебный план"
      component={ShortTeachPlan}
      options={{
        headerShown: false,
        tabBarLabel: renderOptionTitle('Учебный план'),
        tabBarIcon: ({ size, color }) => <FontAwesome name="list-alt" size={size} color={color} />,
        tabBarActiveTintColor: '#CE2539',
      }}
    />
    <Tab.Screen
      name="Оценки"
      component={Signs}
      options={{
        headerShown: false,
        tabBarLabel: renderOptionTitle('Оценки'),
        tabBarIcon: ({ size, color }) => <MaterialIcons name="grade" size={size} color={color} />,
        tabBarActiveTintColor: '#CE2539',
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;
