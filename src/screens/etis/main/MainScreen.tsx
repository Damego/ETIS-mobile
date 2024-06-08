import React, { useEffect } from 'react';
import { cache } from '~/cache/smartCache';
import Screen from '~/components/Screen';
import { useClient } from '~/data/client';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { RequestType } from '~/models/results';
import { setStudentState } from '~/redux/reducers/studentSlice';
import { registerSignsFetchTask } from '~/tasks/signs/signs';

import Header from './components/Header';
import { Timetable } from './components/Timetable';

const ETISScreen = () => {
  const dispatch = useAppDispatch();
  const { messageCount, announceCount, hasUnverifiedEmail } = useAppSelector(
    (state) => state.student
  );
  const {
    config: { signNotificationEnabled },
  } = useAppSelector((state) => state.settings);
  const client = useClient();
  const { isDemo, isOfflineMode } = useAppSelector((state) => state.auth);

  useEffect(() => {
    loadData().then(() => {
      if (signNotificationEnabled && !isDemo && !isOfflineMode) {
        registerSignsFetchTask();
      }
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

  return (
    <Screen>
      <Header />
      <Timetable />
    </Screen>
  );
};

export default ETISScreen;
