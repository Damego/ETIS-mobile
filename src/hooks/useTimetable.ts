import dayjs from 'dayjs';
import { useState } from 'react';
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

let preSelectedDate: dayjs.Dayjs = null;

const useTimetable = ({
  onRequestUpdate,
  skipSunday,
}: {
  onRequestUpdate: (week: number) => void;
  skipSunday?: boolean;
}): IUseTimetable => {
  const [{ currentDate, currentWeek, selectedDate, selectedWeek }, setTimetable] =
    useState<TimetableState>(
      (() => {
        const currentDate = dayjs().startOf('day');
        const currentWeek = getEducationWeekByDate(currentDate);

        return {
          currentDate,
          currentWeek,
          selectedDate: skipSunday ? currentDate.add(1, 'day') : currentDate,
          selectedWeek: skipSunday ? currentWeek + 1 : currentWeek,
        };
      })()
    );

  const updateData = (weekInfo: WeekInfo) => {
    if (preSelectedDate) {
      setTimetable((prev) => ({
        ...prev,
        selectedDate: preSelectedDate,
        selectedWeek: weekInfo.selected ?? selectedWeek,
      }));
      preSelectedDate = null;
    } else if (weekInfo.selected !== null) {
      const startWeekDate = parseDate(weekInfo.dates.start);

      setTimetable((prev) => ({
        ...prev,
        selectedDate: startWeekDate.add(selectedDate.weekday(), 'day'),
        selectedWeek: weekInfo.selected,
      }));
    }
  };

  const onDatePress = ({ date, week }: { date?: dayjs.Dayjs; week?: number }) => {
    if (week !== undefined) {
      return onRequestUpdate(week);
    }

    const weekDiff = date.startOf('isoWeek').diff(selectedDate.startOf('isoWeek'), 'week');
    if (weekDiff === 0) {
      setTimetable((prev) => ({ ...prev, selectedDate: date }));
      return;
    }

    const $week = getEducationWeekByDate(date);
    onRequestUpdate($week);
    preSelectedDate = date;
  };

  const onWeekPress = (week: number) => {
    onRequestUpdate(week);
  };

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
