import React, { useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { cache } from '~/cache/smartCache';
import Screen from '~/components/Screen';
import { useClient } from '~/data/client';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { RequestType } from '~/models/results';
import { setStudentState } from '~/redux/reducers/studentSlice';
import Shortcuts, { Shortcut } from '~/screens/etis/main/components/Shortcuts';
import { registerSignsFetchTask } from '~/tasks/signs/signs';

import Grades from './grades/Grades';
import { Timetable } from './timetable/Timetable';

const shortcutToPage = {
  timetable: 0,
  grades: 1,
  messages: 2,
};

const ETISScreen = () => {
  const dispatch = useAppDispatch();
  const {
    config: { signNotificationEnabled },
  } = useAppSelector((state) => state.settings);
  const client = useClient();
  const { isDemo, isOfflineMode } = useAppSelector((state) => state.auth);
  const [currentShortcut, setCurrentShortcut] = useState<Shortcut>('timetable');
  const pagerRef = useRef<PagerView>(null);

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

  const handleShortcutPress = (shortcut: Shortcut) => {
    pagerRef.current.setPageWithoutAnimation(shortcutToPage[shortcut]);
  };

  return (
    <PagerView style={{ flex: 1 }} initialPage={0} ref={pagerRef} scrollEnabled={false}>
      <Timetable key={'1'} onShortcutPress={handleShortcutPress} />
      <Grades key={'2'} onShortcutPress={handleShortcutPress} />
    </PagerView>
  );
};

export default ETISScreen;
