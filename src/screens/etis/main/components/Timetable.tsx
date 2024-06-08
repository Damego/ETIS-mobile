import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/components/Text';
import TimeTableContext from '~/context/timetableContext';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import Dates from '~/screens/etis/main/components/Dates';
import Pair from '~/screens/etis/main/components/Pair';
import { LoadingContainer } from '~/components/LoadingScreen';

export const Timetable = () => {
  const client = useClient();
  const { data, isLoading, currentWeek } = useTimeTableQuery();
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
  });

  const currentDate = dayjs();

  const contextData = useMemo(
    () => ({ teachers: teachersData, currentDate }),
    [teachersData, currentDate]
  );

  if (isLoading || teachersIsLoading) {
    return <LoadingContainer />
  }

  // 0 - понедельник, 5 - суббота, -1 - воскресенье
  // Происходит это из-за того, что в dayjs 0 - воскресенье
  const currentDayIndex = currentDate.day() - 1;

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: '2%',
          marginVertical: '2%',
        }}
      >
        <Text style={{ fontWeight: '500', fontSize: 18 }}>Расписание</Text>
        <Text style={{ fontWeight: '500', fontSize: 18, textDecorationLine: 'underline' }}>
          {currentWeek} неделя
        </Text>
      </View>
      <TimeTableContext.Provider value={contextData}>
        <Dates />

        <View style={styles.timetableContainer}>
          {data.days[currentDayIndex].pairs.map((pair) => (
            <Pair pair={pair} key={pair.position} />
          ))}
        </View>
      </TimeTableContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  timetableContainer: {
    marginTop: '4%',
    marginHorizontal: '2%',
    gap: 8,
  },
});
