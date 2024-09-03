import React from 'react';
import { StyleSheet } from 'react-native';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import useTimetable from '~/hooks/useTimetable';

export const Timetable = () => {
  const client = useClient();
  const { data, isLoading, loadWeek, refresh } = useTimeTableQuery({
    afterCallback: (result) => {
      timetable.updateData(result.data.weekInfo);
    },
  });
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
  });
  const timetable = useTimetable({ onRequestUpdate: (week) => loadWeek(week) });

  return (
    <Screen onUpdate={refresh}>
      <Text style={styles.titleText}>Расписание</Text>

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
  titleText: { fontWeight: '700', fontSize: 22 },
});
