import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import CenteredText from '~/components/CenteredText';
import TimetablePages from '~/components/timetable/dayTimetable/components/TimetablePages';
import TimetableCalendar, {
  TimetableCalendarModes,
} from '~/components/timetable/dayTimetable/components/timetableCalendar/TimetableCalendar';
import TimeTableContext from '~/context/timetableContext';
import { DatePressT } from '~/hooks/useTimetable';
import { ITeacher } from '~/models/teachers';
import { ITimeTable } from '~/models/timeTable';

const getWeekDiffDate = (date: dayjs.Dayjs, a: number, b: number) => {
  return date
    .clone()
    .startOf('isoWeek')
    .add(a - b, 'week');
};

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
}: {
  data: ITimeTable;
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
}) => {
  const pagerRef = useRef<PagerView>(null);

  const contextData = useMemo(
    () => ({
      teachers,
      selectedDate,
      currentDate,
      selectedWeek,
      currentWeek,
    }),
    [teachers, selectedDate]
  );

  const handleDatePress = ({ date, week }: { date?: dayjs.Dayjs; week?: number }, mode: TimetableCalendarModes) => {
    console.log(date, week)
    if (mode === 'week' && date) {
      if (pagerRef.current) {
        pagerRef.current.setPage(date.weekday());
      }
    }
    else onDatePress({ date, week });
  }

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
        periodStartDate={startDate ?? $startDate}
        periodEndDate={endDate ?? $endDate}
        onDatePress={handleDatePress}
      />
      {/* eslint-disable-next-line no-nested-ternary */}
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
          days={data.days}
          dayNumber={selectedDate.weekday()}
        />
      ) : (
        <CenteredText>Расписания нет</CenteredText>
      )}
    </TimeTableContext.Provider>
  );
};

export default React.memo(DayTimetable);
