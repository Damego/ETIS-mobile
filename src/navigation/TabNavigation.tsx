import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import useNotification from '~/hooks/useNotifications';
import EducationNavigation from '~/navigation/EducationNavigation';
import { headerParams } from '~/navigation/header';
import AppSettingButton from '~/navigation/headerButtons/AppSettingsButton';
import Events from '~/screens/events/Events';
import Services from '~/screens/services/Services';

import { BottomTabsParamList, BottomTabsScreenProps } from './types';

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const TabNavigator = ({ navigation }: BottomTabsScreenProps) => {
  useNotification(async (data) => {
    if (data.type === 'task-reminder') {
      // @ts-expect-error: TS2345
      navigation.navigate('Education', { screen: 'DisciplineTasks', taskId: data.data.taskId });
    }
  });
  const theme = useAppTheme();

  return (
    <Tab.Navigator screenOptions={{ headerShown: true, ...headerParams(theme) }}>
      <Tab.Screen
        name="Education"
        component={EducationNavigation}
        options={{
          title: 'ЕТИС',
          headerShown: false,
          tabBarIcon: ({ size, color }) => <AntDesign name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Services"
        component={Services}
        options={{
          title: 'Сервисы',
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="appstore-o" size={size} color={color} />
          ),
          headerRight: () => <AppSettingButton />,
        }}
      />
      <Tab.Screen
        name="NewsAndEvents"
        component={Events}
        options={{
          title: 'События',
          tabBarIcon: ({ size, color }) => <AntDesign name="calendar" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
