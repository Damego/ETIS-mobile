import dayjs from 'dayjs';
import { useRef, useState } from 'react';

import { WeekInfo } from '~/models/timeTable';
import { parseDate } from '~/parser/utils';
import { getEducationWeekByDate } from '~/utils/datetime';

export type DatePressT = ({ date, week }: { date?: dayjs.Dayjs; week?: number }) => void;

interface TimetableState {
  currentDate?: dayjs.Dayjs;
  currentWeek?: number;
  selectedDate?: dayjs.Dayjs;
  selectedWeek?: number;
}

export interface IUseTimetable {
  currentDate: dayjs.Dayjs;
  currentWeek: number;
  selectedDate: dayjs.Dayjs;
  selectedWeek: number;
  updateData: (weekInfo: WeekInfo) => void;
  onDatePress: DatePressT;
  onWeekPress: (week: number) => void;
}

const useTimetable = ({
  onRequestUpdate,
  skipSunday,
}: {
  onRequestUpdate: (week: number) => void;
  skipSunday?: boolean;
}): IUseTimetable => {
  const [timetableState, setTimetable] = useState<TimetableState>(
    (() => {
      const currentDate = dayjs().startOf('day');
      const currentWeek = getEducationWeekByDate(currentDate);

      const $skipSunday = skipSunday && currentDate.day() === 0;

      return {
        currentDate,
        currentWeek,
        selectedDate: $skipSunday ? currentDate.add(1, 'day') : currentDate,
        selectedWeek: $skipSunday ? currentWeek + 1 : currentWeek,
      };
    })()
  );

  const { currentDate, currentWeek, selectedDate, selectedWeek } = timetableState;
  const preSelectedDate = useRef<dayjs.Dayjs | null>(null);

  const updateData = (weekInfo: WeekInfo) => {
    if (preSelectedDate.current) {
      setTimetable({
        ...timetableState,
        selectedDate: preSelectedDate.current.clone(),
        selectedWeek: weekInfo.selected ?? selectedWeek,
      });
      preSelectedDate.current = null;
    } else if (weekInfo.selected != null && weekInfo.dates != null) {
      const startWeekDate = parseDate(weekInfo.dates.start);

      setTimetable((prev) => ({
        ...prev,
        selectedDate: startWeekDate.add((selectedDate ?? prev.selectedDate ?? dayjs()).weekday(), 'day'),
        selectedWeek: weekInfo.selected ?? undefined,
      }));
    }
  };

  const onDatePress = ({ date, week }: { date?: dayjs.Dayjs; week?: number }) => {
    if (week !== undefined) {
      return onRequestUpdate(week);
    }
    if (!date) return;

    const weekDiff = date.startOf('isoWeek').diff((selectedDate ?? date).startOf('isoWeek'), 'week');
    if (weekDiff === 0) {
      setTimetable((prev) => ({ ...prev, selectedDate: date }));
      return;
    }

    const $week = getEducationWeekByDate(date);
    onRequestUpdate($week);
    preSelectedDate.current = date;
  };

  const onWeekPress = (week: number) => {
    onRequestUpdate(week);
  };

  // Инициализатор состояния задаёт все поля, поэтому после гварда они не опциональны
  if (!currentDate || !currentWeek || !selectedDate || !selectedWeek) {
    throw new Error('useTimetable: state is not initialized');
  }

  return {
    currentDate,
    currentWeek,
    selectedDate,
    selectedWeek,
    updateData,
    onDatePress,
    onWeekPress,
  };
};

export default useTimetable;
