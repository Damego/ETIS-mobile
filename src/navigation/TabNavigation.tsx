import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import EtisNavigation from '~/navigation/EtisNavigation';


import { BottomTabsParamList, BottomTabsScreenProps } from './types';

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const TabNavigator = ({ navigation }: BottomTabsScreenProps) => {
  // useNotification(async (data) => {
  //   if (data.type === 'task-reminder') {
  //     navigation.navigate('DisciplineTasks', { taskId: data.data.taskId });
  //   }
  // });
  //


  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ETIS"
        component={EtisNavigation}
        options={{
          title: 'ЕТИС',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
