import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { parseMenu } from '../parser';
import { setAnnounceCount, setMessageCount, setStudentInfo } from '../redux/studentSlice';
import Announce from '../screens/announce/Announce';
import Signs from '../screens/signs/Signs';
import TimeTablePage from '../screens/timeTable/TimeTable';
import { httpClient } from '../utils';
import MessageStackNavigator from './MessageStackNavigator';
import ServicesStackNavigator from './ServicesStackNavigator';
import useGlobalStyles from '../styles';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const globalStyles = useGlobalStyles();

  const dispatch = useDispatch();
  const messageCount = useSelector((state) => state.student.messageCount);
  const announceCount = useSelector((state) => state.student.announceCount);

  const loadData = async () => {
    const html = await httpClient.getGroupJournal();
    if (!html) return;

    const data = parseMenu(html, true);

    dispatch(setStudentInfo(data.studentInfo))
    dispatch(setMessageCount(data.messageCount));
    dispatch(setAnnounceCount(data.announceCount));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: globalStyles.primaryFontColor.color,
        tabBarShowLabel: false,
        tabBarBadgeStyle: globalStyles.primaryBackgroundColor,
        tabBarHideOnKeyboard: true,
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
          tabBarBadge: messageCount,
          tabBarIcon: ({ size, color }) => <AntDesign name="message1" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Объявления"
        component={Announce}
        options={{
          tabBarBadge: announceCount,
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="notification" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Сервисы-навигатор"
        component={ServicesStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="appstore-o" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
