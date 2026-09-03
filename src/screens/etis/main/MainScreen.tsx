import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SceneMap, TabView } from 'react-native-tab-view';

import { cache } from '~/cache/smartCache';
import { useClient } from '~/data/client';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { RequestType } from '~/models/results';
import { StudentInfo } from '~/parser/menu';
import {
  setCurrentSession,
  setCurrentWeek,
  setStudentState,
} from '~/redux/reducers/studentSlice';
import Shortcuts from '~/screens/etis/main/components/Shortcuts';
import MoreScreens from '~/screens/etis/main/more/MoreScreens';
import prefetch from '~/tasks/prefetch/prefetch';
import { registerSignsFetchTask } from '~/tasks/signs/signs';

import Grades from './grades/Grades';
import MessagesTabs from './messages/MessagesTabs';
import { Timetable } from './timetable/Timetable';

const renderScene = SceneMap({
  timetable: Timetable,
  grades: Grades,
  messageTabs: MessagesTabs,
  more: MoreScreens,
});

const ETISScreen = () => {
  const dispatch = useAppDispatch();
  const {
    config: { signNotificationEnabled },
  } = useAppSelector((state) => state.settings);
  const client = useClient();
  const { isDemo, isOfflineMode } = useAppSelector((state) => state.account);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData().then(() => {
      if (!isDemo && !isOfflineMode) {
        prefetch(client).then((result) => {
          if (result?.currentWeek) dispatch(setCurrentWeek(result.currentWeek));
          if (result?.currentSession) dispatch(setCurrentSession(result.currentSession));
          if (signNotificationEnabled) {
            registerSignsFetchTask(result?.currentSession ?? undefined);
          }
        });
      }
    });
  }, []);

  const loadData = async () => {
    const cached = await client.getStudentInfoData({ requestType: RequestType.forceCache });
    if (isDemo || isOfflineMode) {
      if (cached.data) {
        dispatch(setStudentState(cached.data));
      }
      return;
    }

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

    let data: StudentInfo = {} as StudentInfo;
    if (cached.data) data = { ...data, ...cached.data };
    if (fetched.data) data = { ...data, ...fetched.data };
    dispatch(setStudentState(data));
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'timetable', title: 'timetable' },
    { key: 'grades', title: 'grades' },
    { key: 'messageTabs', title: 'messageTabs' },
    { key: 'more', title: 'more' },
  ]);

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <TabView
        lazy
        swipeEnabled={false}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={Shortcuts}
      />
    </View>
  );
};

export default ETISScreen;
