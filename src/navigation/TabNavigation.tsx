import { AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as QuickActions from 'expo-quick-actions';
import React, { useEffect } from 'react';

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
import { registerSignsFetchTask } from '../tasks/signs';
import { AppShortcutItem } from '../utils/shortcuts';
import ServicesStackNavigator from './ServicesStackNavigator';
import SignsTopTabNavigator from './TopTabNavigator';
import { headerParams } from './header';
import { BottomTabsParamList, BottomTabsScreenProps } from './types';
import { registerReminderTask } from '../tasks/disciplineTasks';

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const TabNavigator = ({ navigation }: BottomTabsScreenProps) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const dispatch = useAppDispatch();
  const { messageCount, announceCount, hasUnverifiedEmail } = useAppSelector(
    (state) => state.student
  );
  const { signNotification, initialPage } = useAppSelector((state) => state.settings);
  const client = useClient();
  const { isDemo, isOfflineMode } = useAppSelector((state) => state.auth);

  useEffect(() => {
    QuickActions.addListener((data: AppShortcutItem) => {
      navigation.navigate(data.id);
    });
  }, []);

  const loadData = async () => {
    if (isDemo || isOfflineMode) {
      const result = await client.getStudentInfoData({ requestType: RequestType.forceCache });
      if (result.data) {
        dispatch(setStudentState(result.data));
      }
      return;
    }

    const cached = await client.getStudentInfoData({ requestType: RequestType.forceCache });
    const cachedStudent = cached.data?.student ? { ...cached.data.student } : null;
    const fetched = await client.getStudentInfoData({ requestType: RequestType.forceFetch });

    if (!cached.data && !fetched.data) return; // edge case

    if (
      cachedStudent &&
      fetched.data?.student &&
      cachedStudent.group !== fetched.data.student.group
    ) {
      await cache.clear();
      await cache.placePartialStudent(fetched.data);
    }

    if (fetched.data || cached.data) dispatch(setStudentState(fetched.data || cached.data));
  };

  useEffect(() => {
    loadData().then(() => {
      if (signNotification && !isDemo && !isOfflineMode) {
        registerSignsFetchTask();
      }
    });
    registerReminderTask();
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
        name="ServicesNavigator"
        component={ServicesStackNavigator}
        options={{
          headerShown: false,
          title: 'Сервисы',
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="appstore-o" size={size} color={color} />
          ),
          tabBarBadge: hasUnverifiedEmail ? '!' : undefined,
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
