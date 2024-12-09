import React, { useEffect } from 'react';
import { SceneMap, TabView } from 'react-native-tab-view';
import { cache } from '~/cache/smartCache';
import Shortcuts from '~/components/education/main/components/Shortcuts';
import Grades from '~/components/education/main/grades/Grades';
import MessagesTabs from '~/components/education/main/messages/MessagesTabs';
import MoreScreens from '~/components/education/main/more/MoreScreens';
import { Timetable } from '~/components/education/main/timetable/Timetable';
import { useClient } from '~/data/client';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { RequestType } from '~/models/results';
import { StudentInfo } from '~/parser/menu';
import { setStudentState } from '~/redux/reducers/studentSlice';
import { registerSignsFetchTask } from '~/tasks/signs/signs';

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

  useEffect(() => {
    loadData().then(() => {
      if (signNotificationEnabled && !isDemo && !isOfflineMode) {
        registerSignsFetchTask();
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
    <TabView
      lazy
      swipeEnabled={false}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={Shortcuts}
    />
  );
};

export default ETISScreen;
