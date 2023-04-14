import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Text } from 'react-native';
import { FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';

import ShortTeachPlan from '../screens/shortTeachPlan/shortTeachPlan';
import TimeTablePage from '../screens/timeTable/TimeTable';
import Signs from '../screens/signs/Signs';
import { GLOBAL_STYLES } from '../styles/styles';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator screenOptions={GLOBAL_STYLES.buttonNavigator}>
    <Tab.Screen
      name="Расписание"
      component={TimeTablePage}
      options={{
        headerShown: false,
        tabBarLabel: () => (
          <Text style={GLOBAL_STYLES.textIcon}>Расписание</Text>
        ),
        tabBarIcon: ({ size, color }) => (
          <AntDesign name="calendar" size={size} color={color} />
        ),
        tabBarActiveTintColor: '#CE2539',
      }}
    />
    <Tab.Screen 
      name="Учебный план" 
      component={ShortTeachPlan}
      options={{ 
        headerShown: false,
        tabBarLabel: () => (
          <Text style={GLOBAL_STYLES.textIcon}>Учебный план</Text>
        ),
        tabBarIcon: ({ size, color }) => (
          <FontAwesome name="list-alt" size={size} color={color} />
        ),
        tabBarActiveTintColor: '#CE2539',
      }} />
    <Tab.Screen 
      name="Оценки" 
      component={Signs} 
      options={{ 
        headerShown: false,
        tabBarLabel: () => (
          <Text style={GLOBAL_STYLES.textIcon}>Оценки</Text>
        ),
        tabBarIcon: ({ size, color }) => (
          <MaterialIcons name="grade" size={size} color={color} />
        ),
        tabBarActiveTintColor: '#CE2539',
      }} />
  </Tab.Navigator>
);

export default TabNavigator;
