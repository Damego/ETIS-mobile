import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';
import dayjs from 'dayjs';
import React, { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '~/components/Button';
import CenteredText from '~/components/CenteredText';
import TimetableCalendar, {
  TimetableCalendarModes,
} from '~/components/timetable/dayTimetable/components/timetableCalendar/TimetableCalendar';
import TimetablePages, { type PagerScrollState } from '~/components/timetable/dayTimetable/components/TimetablePages';
import TimeTableContext from '~/context/timetableContext';
import { useAppSelector } from '~/hooks';
import { DatePressT } from '~/hooks/useTimetable';
import { ITeacher } from '~/models/teachers';
import { ITimeTable } from '~/models/timeTable';

const getWeekDiffDate = (date: dayjs.Dayjs, a: number, b: number) => date
  .clone()
  .startOf('isoWeek')
  .add(a - b, 'week');

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    gap: 8,
  },
});

const DayTimetable = ({
  data,
  selectedDate,
  selectedWeek,
  currentDate,
  currentWeek,
  startDate,
  endDate,
  teachers,
  onDatePress,
  isLoading,
  loadingComponent,
  onRetry,
  onPagerScrollStateChange,
}: {
  data?: ITimeTable | null;
  selectedDate: dayjs.Dayjs;
  selectedWeek: number;
  currentDate: dayjs.Dayjs;
  currentWeek: number;
  startDate?: dayjs.Dayjs;
  endDate?: dayjs.Dayjs;
  teachers?: ITeacher[];
  onDatePress: DatePressT;
  isLoading?: boolean;
  loadingComponent?: () => React.ReactNode;
  onRetry?: () => void;
  onPagerScrollStateChange?: (state: PagerScrollState) => void;
}) => {
  const pagerRef = useRef<PagerViewRef>(null);
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);

  const contextData = useMemo(
    () => ({
      teachers,
      selectedDate,
      currentDate,
      selectedWeek,
      currentWeek,
    }),
    [teachers, selectedDate, currentDate, selectedWeek, currentWeek]
  );

  const handleDatePress = (
    { date, week }: { date?: dayjs.Dayjs; week?: number },
    mode: TimetableCalendarModes
  ) => {
    if (date) {
      if (pagerRef.current) {
        pagerRef.current.setPage(date.weekday());
      }
    }
    onDatePress({ date, week });
  };

  const $startDate = useMemo(
    () => data && getWeekDiffDate(currentDate, data.weekInfo.first - 1, currentWeek),
    [currentWeek, currentDate, data]
  );
  const $endDate = useMemo(
    () => data && getWeekDiffDate(currentDate, data.weekInfo.last + 1, currentWeek),
    [currentWeek, currentDate, data]
  );

  return (
    <TimeTableContext.Provider value={contextData}>
      <TimetableCalendar
        periodStartDate={startDate ?? $startDate ?? undefined}
        periodEndDate={endDate ?? $endDate ?? undefined}
        firstWeek={data?.weekInfo.first}
        lastWeek={data?.weekInfo.last}
        skipSunday={skipSunday}
        onDatePress={handleDatePress}
      />
      {loadingComponent !== undefined && isLoading ? (
        loadingComponent()
      ) : data ? (
        <TimetablePages
          ref={pagerRef}
          onPagePress={(direction) => {
            // direction: -1 or 1
            // Нужно для свайпа между днями
            onDatePress({ date: selectedDate.clone().add(direction, 'day') });
          }}
          onPagerScrollStateChange={onPagerScrollStateChange}
          days={data.days}
          dayNumber={selectedDate.weekday()}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <CenteredText>Расписания нет</CenteredText>
          {onRetry && <Button text='Обновить' onPress={onRetry} variant='card' />}
        </View>
      )}
    </TimeTableContext.Provider>
  );
};

export default React.memo(DayTimetable);
