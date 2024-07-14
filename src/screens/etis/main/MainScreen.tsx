import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { cache } from '~/cache/smartCache';
import { useClient } from '~/data/client';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { RequestType } from '~/models/results';
import { setStudentState } from '~/redux/reducers/studentSlice';
import Shortcuts from '~/screens/etis/main/components/Shortcuts';
import MoreScreens from '~/screens/etis/main/more/MoreScreens';
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
  const { isDemo, isOfflineMode } = useAppSelector((state) => state.auth);

  useEffect(() => {
    loadData();
    //   .then(() => {
    //   if (signNotificationEnabled && !isDemo && !isOfflineMode) {
    //     registerSignsFetchTask();
    //   }
    // });
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

    if (fetched.data || cached.data) dispatch(setStudentState(fetched.data || cached.data));
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'timetable', title: 'timetable' },
    { key: 'grades', title: 'grades' },
    { key: 'messageTabs', title: 'messageTabs' },
    { key: 'more', title: 'more' },
  ]);
  const layout = useWindowDimensions();

  return (
    <TabView
      style={{ flex: 1 }}
      lazy
      swipeEnabled={false}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={Shortcuts}
    />
  );
};

export default ETISScreen;
