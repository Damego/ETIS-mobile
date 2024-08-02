import React from 'react';
import { StyleSheet } from 'react-native';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import DayTimetable from '~/components/timetable/DayTimetable';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import useTimetable from '~/hooks/useTimetable';

export const Timetable = () => {
  const client = useClient();
  const { data, isLoading, loadWeek, currentWeek } = useTimeTableQuery({
    afterCallback: (result) => {
      timetable.updateData(result.data.weekInfo);
    },
  });
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
  });
  const timetable = useTimetable({ onRequestUpdate: (week) => loadWeek(week) });

  return (
    <Screen>
      <Text style={styles.titleText}>Расписание</Text>

      <DayTimetable
        timetable={data}
        teachers={teachersData}
        selectedDate={timetable.selectedDate}
        currentDate={timetable.currentDate}
        currentWeek={currentWeek}
        onDatePress={timetable.onDatePress}
        isLoading={isLoading || teachersIsLoading || !data}
        loadingComponent={() => <LoadingContainer />}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleText: { fontWeight: '700', fontSize: 22 },
});
