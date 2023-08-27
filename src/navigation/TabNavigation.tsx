import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { DeviceEventEmitter, ToastAndroid } from 'react-native';
import { ShortcutItem } from 'react-native-quick-actions';

import { getWrappedClient } from '../data/client';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../hooks';
import { useAppTheme } from '../hooks/theme';
import { GetResultType, RequestType } from '../models/results';
import { setAuthorizing } from '../redux/reducers/authSlice';
import { setStudentState } from '../redux/reducers/studentSlice';
import Announce from '../screens/announce/Announce';
import Messages from '../screens/messages/Messages';
import TimeTablePage from '../screens/timeTable/TimeTable';
import { registerFetch } from '../tasks/signs';
import ServicesStackNavigator from './ServicesStackNavigator';
import SignsTopTabNavigator from './TopTabNavigator';
import { headerParams } from './header';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const dispatch = useAppDispatch();
  const { messageCount, announceCount } = useAppSelector((state) => state.student);
  const { signNotification, initialPage } = useAppSelector((state) => state.settings);
  const client = getWrappedClient();
  const isDemo = useAppSelector((state) => state.auth.isDemo);
  const navigation = useNavigation();

  useEffect(() => {
    DeviceEventEmitter.addListener('quickActionShortcut', (data: ShortcutItem) => {
      if (data.type !== 'debug') {
        navigation.navigate(data.type);
      } else {
        ToastAndroid.show('Перезапустите приложение через ярлык', ToastAndroid.LONG);
      }
    });
  }, []);

  const loadData = async () => {
    const result = await client.getStudentInfoData({ requestType: RequestType.tryFetch });

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    const data = result.data;

    dispatch(setStudentState(data));
  };

  useEffect(() => {
    if (signNotification && !isDemo) {
      registerFetch();
    }
    loadData();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={initialPage}
      screenOptions={{
        headerShown: true,
        ...headerParams(theme),
        tabBarVisibilityAnimationConfig: {
          show: {
            animation: 'timing',
            config: {
              duration: 50,
            },
          },
        },

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
