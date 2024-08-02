import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import TimetablePages from '~/components/timetable/dayTimetable/components/TimetablePages';
import TimetableCalendar from '~/components/timetable/dayTimetable/components/timetableCalendar/TimetableCalendar';
import TimeTableContext from '~/context/timetableContext';
import { ITeacher } from '~/models/teachers';
import { ITimeTable } from '~/models/timeTable';

const getWeekDiffDate = (date: dayjs.Dayjs, a: number, b: number) => {
  return date
    .clone()
    .startOf('isoWeek')
    .add(a - b, 'week');
};

const DayTimetable = ({
  timetable,
  selectedDate,
  selectedWeek,
  currentDate,
  currentWeek,
  teachers,
  onDatePress,
  isLoading,
  loadingComponent,
}: {
  timetable: ITimeTable;
  selectedDate: dayjs.Dayjs;
  selectedWeek: number;
  currentDate: dayjs.Dayjs;
  currentWeek: number;
  teachers?: ITeacher[];
  onDatePress: (date: dayjs.Dayjs) => void;
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

  useEffect(() => {
    if (pagerRef.current) {
      pagerRef.current.setPage(selectedDate.weekday());
    }
  }, [selectedDate]);

  const startDate = useMemo(
    () =>
      !timetable
        ? currentDate
        : getWeekDiffDate(currentDate, timetable.weekInfo.first - 1, currentWeek),
    [currentWeek, currentDate, timetable]
  );
  const endDate = useMemo(
    () =>
      !timetable
        ? currentDate
        : getWeekDiffDate(currentDate, timetable.weekInfo.last + 1, currentWeek),
    [currentWeek, currentDate, timetable]
  );

  return (
    <TimeTableContext.Provider value={contextData}>
      <TimetableCalendar
        periodStartDate={startDate}
        periodEndDate={endDate}
        onDatePress={onDatePress}
      />
      {loadingComponent !== undefined && isLoading ? (
        loadingComponent()
      ) : (
        <TimetablePages
          ref={pagerRef}
          onPagePress={(pageNumber) => onDatePress(selectedDate.clone().add(pageNumber, 'day'))}
          days={timetable.days}
          dayNumber={selectedDate.weekday()}
        />
      )}
    </TimeTableContext.Provider>
  );
};

export default React.memo(DayTimetable);
