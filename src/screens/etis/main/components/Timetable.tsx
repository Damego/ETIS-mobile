import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CenteredText from '~/components/CenteredText';
import { LoadingContainer } from '~/components/LoadingScreen';
import Text from '~/components/Text';
import TimeTableContext from '~/context/timetableContext';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import Dates from '~/screens/etis/main/components/Dates';
import Pair from '~/screens/etis/main/components/Pair';
import { capitalizeWord } from '~/utils/texts';
import { getRandomItem } from '~/utils/utils';

const noPairsResponses = [
  'Можно поиграть 🎮',
  'Можно поспать 💤',
  'Можно отдохнуть 😴',
  'Нужно сделать домашку 📚',
];

const NoPairsContainer = () => (
  <View
    style={{
      backgroundColor: '#FEFEFE',
      width: '90%',
      alignSelf: 'center',
      marginTop: '4%',
      paddingVertical: '2%',
      borderRadius: 10,
      alignItems: 'center',
    }}
  >
    <CenteredText>В этот день занятий нет</CenteredText>
    <Text>{getRandomItem(noPairsResponses)}</Text>
  </View>
);

export const Timetable = () => {
  const client = useClient();
  const { data, isLoading, loadWeek } = useTimeTableQuery();
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
  });

  const currentDate = dayjs().startOf('day');
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const contextData = useMemo(
    () => ({ teachers: teachersData, currentDate }),
    [teachersData, currentDate]
  );

  const handlePrevWeek = () => {
    loadWeek(data.weekInfo.selected - 1);
    setSelectedDate((prev) => prev.clone().add(-1, 'week'));
  };
  const handleNextWeek = () => {
    loadWeek(data.weekInfo.selected + 1);
    setSelectedDate((prev) => prev.clone().add(1, 'week'));
  };

  const onDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
  };

  // 0 - понедельник, 5 - суббота, -1 - воскресенье
  // Происходит это из-за того, что в dayjs 0 - воскресенье
  const selectedDayIndex = selectedDate.day() - 1;

  let component: React.ReactNode;
  console.log(selectedDayIndex, data.days);

  if (isLoading || teachersIsLoading || !data) {
    component = <LoadingContainer />;
  } else if (selectedDayIndex === -1 || !data.days[selectedDayIndex].pairs.length) {
    component = <NoPairsContainer />;
  } else {
    component = (
      <View style={styles.pairsList}>
        {data.days[selectedDayIndex].pairs.map(
          (pair) =>
            !!pair.lessons.length && <Pair pair={pair} key={pair.position} dayDate={selectedDate} />
        )}
      </View>
    );
  }

  return (
    <>
      <View style={styles.timetableContainer}>
        <Text style={{ fontWeight: '500', fontSize: 18 }}>Расписание</Text>
        <Text>
          {capitalizeWord(selectedDate.format('MMMM'))} {selectedDate.get('year')}
          {data ? ` • ${data.weekInfo.selected} неделя` : ''}
        </Text>
      </View>
      <TimeTableContext.Provider value={contextData}>
        <Dates
          selectedDate={selectedDate}
          onDatePress={onDatePress}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />
        {component}
      </TimeTableContext.Provider>
    </>
  );
};

const styles = StyleSheet.create({
  timetableContainer: {
    marginVertical: '2%',
  },
  pairsList: {
    marginTop: '4%',
    gap: 8,
  },
});
