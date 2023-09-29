import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { DeviceEventEmitter, ToastAndroid } from 'react-native';
import { ShortcutItem } from 'react-native-quick-actions';

import { cache } from '../cache/smartCache';
import { useClient } from '../data/client';
import { useAppDispatch, useAppSelector, useGlobalStyles } from '../hooks';
import { useAppTheme } from '../hooks/theme';
import { RequestType } from '../models/results';
import { setStudentState } from '../redux/reducers/studentSlice';
import Announce from '../screens/announce/Announce';
import Messages from '../screens/messages/Messages';
import AboutSignsDetails from '../screens/signs/AboutSignsDetails';
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
  const client = useClient();
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

  const loadPersonalRecords = async () => {
    const cached = await client.getPersonalRecords({ requestType: RequestType.forceCache });
    const fetched = await client.getPersonalRecords({ requestType: RequestType.forceFetch });

    if (!cached.data || !fetched.data) return;

    const cachedCurrentPR = cached.data[cached.data.findIndex((record) => !record.id)];
    const fetchedCurrentPR = fetched.data[fetched.data.findIndex((record) => !record.id)];
    if (cachedCurrentPR.index !== fetchedCurrentPR.index) {
      // Так как кэш содержит данные одной личной записи, а данные пришли из другой, то очищаем кэш, дабы избежать коллизий.
      await cache.clear();
      await cache.placePersonalRecords(fetched.data);
    }
  };

  const loadData = async () => {
    if (!isDemo) {
      await loadPersonalRecords();
    }

    const result = await client.getStudentInfoData({ requestType: RequestType.tryFetch });
    if (result.data) {
      dispatch(setStudentState(result.data));
    }
  };

  useEffect(() => {
    loadData().then(() => {
      if (signNotification && !isDemo) {
        registerFetch();
      }
    });
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
          headerRight: () => <AboutSignsDetails />,
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
