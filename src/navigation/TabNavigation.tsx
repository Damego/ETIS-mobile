import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../hooks';
import { useAppTheme } from '../hooks/theme';
import { setAnnounceCount, setMessageCount, setStudentInfo } from '../redux/reducers/studentSlice';
import Announce from '../screens/announce/Announce';
import Messages from '../screens/messages/Messages';
import TimeTablePage from '../screens/timeTable/TimeTable';
import { registerFetch } from '../tasks/signs';
import ServicesStackNavigator from './ServicesStackNavigator';
import SignsTopTabNavigator from './TopTabNavigator';
import { headerParams } from './header';
import { getWrappedClient } from '../data/client';
import { RequestType } from '../models/results';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const dispatch = useAppDispatch();
  const { messageCount, announceCount } = useAppSelector((state) => state.student);
  const sendNotifications = useAppSelector((state) => state.settings.signNotification);
  const client = getWrappedClient();
  const loadData = async () => {
    const result = await client.getStudentInfoData({ requestType: RequestType.tryCache });
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
        headerShown: true,
        ...headerParams(theme),

        tabBarActiveTintColor: globalStyles.primaryFontColor.color,
        tabBarShowLabel: false,
        tabBarBadgeStyle: globalStyles.primaryBackgroundColor,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Timetable"
        component={TimeTablePage}
        options={{
          title: 'Расписание',
          tabBarIcon: ({ size, color }) => <AntDesign name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="SignsNavigator"
        component={SignsTopTabNavigator}
        options={{
          title: 'Оценки',
          tabBarIcon: ({ size, color }) => <AntDesign name="barschart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          title: 'Сообщения',
          tabBarBadge: messageCount,
          tabBarIcon: ({ size, color }) => <AntDesign name="message1" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Announces"
        component={Announce}
        options={{
          title: 'Объявления',
          tabBarBadge: announceCount,
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="notification" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesStackNavigator}
        options={{
          headerShown: false,
          title: 'Сервисы',
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="appstore-o" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
