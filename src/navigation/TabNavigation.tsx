import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useAppTheme } from '~/hooks/theme';
import useNotification from '~/hooks/useNotifications';
import EtisNavigation from '~/navigation/EtisNavigation';
import { headerParams } from '~/navigation/header';
import AppSettingButton from '~/navigation/headerButtons/AppSettingsButton';
import { SettingButton } from '~/screens/etis/etisServices/Services';
import Events from '~/screens/events/Events';
import News from '~/screens/news/News';
import Services from '~/screens/services/Services';

import { BottomTabsParamList, BottomTabsScreenProps } from './types';

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const TabNavigator = ({ navigation }: BottomTabsScreenProps) => {
  useNotification(async (data) => {
    if (data.type === 'task-reminder') {
      // @ts-expect-error: TS2345
      navigation.navigate('ETIS', { screen: 'DisciplineTasks', taskId: data.data.taskId });
    }
  });
  const theme = useAppTheme();

  return (
    <Tab.Navigator screenOptions={{ headerShown: true, ...headerParams(theme) }}>
      <Tab.Screen
        name="ETIS"
        component={EtisNavigation}
        options={{
          title: 'ЕТИС',
          headerShown: false,
          tabBarIcon: ({ size, color }) => <AntDesign name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="services"
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
        name="events"
        component={Events}
        options={{
          title: 'События',
          tabBarIcon: ({ size, color }) => <AntDesign name="staro" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="news"
        component={News}
        options={{
          title: 'Новости',
          tabBarIcon: ({ size, color }) => <AntDesign name="calendar" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
