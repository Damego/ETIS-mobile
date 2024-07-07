import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TimeTableContext from '~/context/timetableContext';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import TimetableCalendar from '~/screens/etis/main/components/timetableCalendar/TimetableCalendar';
import TimetablePages from '~/screens/etis/main/timetable/TimetablePages';
import { capitalizeWord } from '~/utils/texts';

const getWeekDiffDate = (date: dayjs.Dayjs, a: number, b: number) => {
  return date
    .clone()
    .startOf('week')
    .add(a - b, 'week');
};

export const Timetable = () => {
  const client = useClient();
  const { data, isLoading, loadByDate, currentWeek, selectedDate, selectDate, currentDate } =
    useTimeTableQuery();
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
  });
  const pagerRef = useRef<PagerView>(null);

  const contextData = useMemo(
    () => ({
      teachers: teachersData,
      selectedDate,
      currentDate,
      selectedWeek: data?.weekInfo?.selected,
      currentWeek,
    }),
    [teachersData, selectedDate]
  );

  useEffect(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(selectedDate.weekday());
    }
  }, [selectedDate]);

  const handleDatePress = (date: dayjs.Dayjs) => {
    loadByDate(date);
  };

  const handlePagePress = (pageNumber: number) => {
    selectDate((prev) => prev.clone().add(pageNumber, 'day'));
  };

  let component: React.ReactNode;

  if (isLoading || teachersIsLoading || !data) {
    component = <LoadingContainer />;
  } else {
    component = (
      <TimetablePages
        ref={pagerRef}
        onPagePress={handlePagePress}
        days={data.days}
        dayNumber={selectedDate.weekday()}
      />
    );
  }

  const startDate = useMemo(
    () =>
      !data ? currentDate : getWeekDiffDate(currentDate, data.weekInfo.first - 1, currentWeek),
    [currentWeek, currentDate, data]
  );
  const endDate = useMemo(
    () => (!data ? currentDate : getWeekDiffDate(currentDate, data.weekInfo.last + 1, currentWeek)),
    [currentWeek, currentDate, data]
  );

  return (
    <Screen>
      <Text style={styles.titleText}>Расписание</Text>

      <TimeTableContext.Provider value={contextData}>
        <TimetableCalendar
          periodStartDate={startDate}
          periodEndDate={endDate}
          onDatePress={handleDatePress}
        />
        {component}
      </TimeTableContext.Provider>
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleText: { fontWeight: '700', fontSize: 22 },
});
