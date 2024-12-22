import React from 'react';
import { StyleSheet, View } from 'react-native';
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
import { httpClient } from '~/utils';
import { parseICalToken } from '~/parser/ical';
import { setICalToken } from '~/redux/reducers/studentSlice';
import { cache } from '~/cache/smartCache';

export const Timetable = () => {
  const dispatch = useAppDispatch();
  const client = useClient();
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);
  const iCalToken = useAppSelector(state => state.student.iCalToken)

  const timetable = useTimetable({
    skipSunday,
    onRequestUpdate: (week) => loadWeek(week),
  });

  const { data, isLoading, loadWeek, refresh } = useTimeTableQuery({
    week: timetable.selectedWeek,
    afterCallback: (result) => {
      timetable.updateData(result.data.weekInfo);

      if (result.data.icalToken && result.data.icalToken !== iCalToken) {
        dispatch(setICalToken(result.data.icalToken));
        cache.placePartialStudent({ iCalToken: result.data.icalToken });
      } else if (!result.data.icalToken) {
        httpClient.subscribeICalendar().then((res) => {
          const token = parseICalToken(res.data);
          dispatch(setICalToken(token));
          cache.placePartialStudent({ iCalToken: token });
        });
      }
    },
  });
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
  });

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
        data={data}
        timetable={timetable}
        teachers={teachersData}
        isLoading={isLoading || teachersIsLoading || !data}
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
