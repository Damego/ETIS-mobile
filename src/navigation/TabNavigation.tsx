import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';

import { getStudentData } from '../data/studentInfo';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../hooks';
import { setAnnounceCount, setMessageCount, setStudentInfo } from '../redux/reducers/studentSlice';
import Announce from '../screens/announce/Announce';
import Messages from '../screens/messages/Messages';
import Signs from '../screens/signs/Signs';
import TimeTablePage from '../screens/timeTable/TimeTable';
import { registerFetch } from '../tasks/signs';
import ServicesStackNavigator from './ServicesStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const globalStyles = useGlobalStyles();

  const dispatch = useAppDispatch();
  const { messageCount, announceCount } = useAppSelector((state) => state.student);
  const sendNotifications = useAppSelector((state) => state.settings.signNotification);

  const loadData = async () => {
    const result = await getStudentData({ useCache: true });
    const data = result.data;

    dispatch(setStudentInfo(data.studentInfo));
    dispatch(setMessageCount(data.messageCount));
    dispatch(setAnnounceCount(data.announceCount));
  };

  useEffect(() => {
    if (sendNotifications) {
      registerFetch();
    }
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
        component={Messages}
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