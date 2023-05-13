import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';

import Announce from '../screens/announce/Announce';
import Signs from '../screens/signs/Signs';
import TimeTablePage from '../screens/timeTable/TimeTable';
import ServicesStackNavigator from './ServicesStackNavigator';
import MessageStackNavigator from './MessageStackNavigator';
import { httpClient, parser } from '../utils';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [announceMessageCount, setAnnounceMessageCount] = useState();

  useEffect(() => {
    const wrapper = async () => {
      const html = await httpClient.getGroupJournal();
      if (!html) return;
      const data = parser.parseMenu(html, true);
      setAnnounceMessageCount(data.announceCount);
    };
    wrapper();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#CE2539',
        tabBarShowLabel: false,
        tabBarBadgeStyle: { backgroundColor: '#CE2539' },
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
        name="Оценки"
        component={Signs}
        options={{
          tabBarIcon: ({ size, color }) => <AntDesign name="barschart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Сообщения"
        component={MessageStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => <AntDesign name="message1" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Объявления"
        component={Announce}
        options={{
          tabBarBadge: announceMessageCount,
          tabBarIcon: ({ size, color }) => <AntDesign name="notification" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Сервисы-навигатор"
        component={ServicesStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => <AntDesign name="appstore-o" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
