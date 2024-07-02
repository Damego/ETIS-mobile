import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CenteredText from '~/components/CenteredText';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TimeTableContext from '~/context/timetableContext';
import { useClient } from '~/data/client';
import { useGlobalStyles } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import Shortcuts, { Shortcut } from '~/screens/etis/main/components/Shortcuts';
import { capitalizeWord } from '~/utils/texts';
import { getRandomItem } from '~/utils/utils';

import Dates from './Dates';
import Pair from './Pair';

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

  useEffect(() => {
    if (data && data.weekInfo.selected !== 30) loadWeek(30);
  }, [data]);

  const onDatePress = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
  };

  const selectedDayIndex = selectedDate.weekday();

  let component: React.ReactNode;

  if (isLoading || teachersIsLoading || !data) {
    component = <LoadingContainer />;
  } else if (selectedDayIndex === 6 || !data.days[selectedDayIndex].pairs.length) {
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
    <Screen>
      <View style={styles.timetableContainer}>
        <Text style={{ fontWeight: '700', fontSize: 22 }}>Расписание</Text>
        <Text style={{ fontWeight: '500', fontSize: 18 }} colorVariant={'text2'}>
          {capitalizeWord(selectedDate.format('MMMM'))} {selectedDate.get('year')}
          {data ? ` • ${data.weekInfo.selected} неделя` : ''}
        </Text>
        <TimeTableContext.Provider value={contextData}>
          <Dates selectedDate={selectedDate} onDatePress={onDatePress} />
          {component}
        </TimeTableContext.Provider>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  timetableContainer: {},
  pairsList: {
    marginTop: '4%',
    gap: 8,
  },
});