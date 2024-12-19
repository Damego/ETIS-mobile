import { useQueryClient, useQuery as useTanstackQuery } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getICalendarData } from '~/api/iCal/api';
import { cache } from '~/cache/smartCache';

import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import BellScheduleButton from '~/components/timetable/buttons/BellScheduleButton';
import DisciplineTasksButton from '~/components/timetable/buttons/DisciplineTasksButton';
import ToggleModeButton from '~/components/timetable/buttons/ToggleModeButton';
import { useClient } from '~/data/client';
import { useAppDispatch, useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import useTimetable from '~/hooks/useTimetable';
import { parseICalToken } from '~/parser/ical';
import { setICalToken } from '~/redux/reducers/studentSlice';
import { httpClient } from '~/utils';

export const Timetable = () => {
  const client = useClient();
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);

  const dispatch = useAppDispatch();
  const student = useAppSelector((state) => state.student);

  const timetable = useTimetable({
    onRequestUpdate: (week) => loadWeek(week), //(!student.iCalToken ?  : null),
    skipSunday,
  });

  // const query = useTanstackQuery({
  //   queryFn: () => getICalendarData(student.iCalToken, student.info?.isLyceum),
  //   queryKey: ['ical', student.iCalToken],
  //   enabled: !!student.iCalToken,
  // });
  //
  // console.log('token', student.iCalToken);

  const { data, isLoading, loadWeek, refresh } = useTimeTableQuery({
    week: timetable.selectedWeek,
    // enabled: !student.iCalToken,
    afterCallback: (result) => {
      timetable.updateData(result.data.weekInfo);

      if (result.data.icalToken && result.data.icalToken !== student.iCalToken) {
        console.log('setting token');
        dispatch(setICalToken(result.data.icalToken));
        cache.placePartialStudent({ iCalToken: result.data.icalToken });
      } else if (!result.data.icalToken) {
        httpClient.subscribeICalendar().then((res) => {
          console.log('new token retrieved');
          const token = parseICalToken(res.data);
          dispatch(setICalToken(token));
          cache.placePartialStudent({ iCalToken: token });
        });
      }
    },
  });
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
    // skipInitialGet: !!student.iCalToken,
  });

  let timetableData = data;

  // if (student.iCalToken && !query.isLoading && query.data) {
  //   timetableData = query.data.find((tt) => tt.weekInfo.selected === timetable.selectedWeek);
  //   console.log('USING ICAL');
  // }

  return (
    <Screen onUpdate={refresh} containerStyle={{ paddingBottom: '20%' }}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Расписание</Text>
        <View style={styles.titleIconsContainer}>
          <ToggleModeButton />
          <BellScheduleButton />
          <DisciplineTasksButton />
        </View>
      </View>

      <TimetableContainer
        data={timetableData}
        timetable={timetable}
        teachers={teachersData}
        isLoading={isLoading || teachersIsLoading || !timetableData}
        loadingComponent={() => <LoadingContainer />}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontWeight: '700',
    fontSize: 22,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
});
