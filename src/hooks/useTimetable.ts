import dayjs from 'dayjs';
import { useState } from 'react';
import { WeekInfo } from '~/models/timeTable';
import { getEducationWeekByDate } from '~/utils/datetime';

interface TimetableState {
  currentDate?: dayjs.Dayjs;
  currentWeek?: number;
  selectedDate?: dayjs.Dayjs;
  selectedWeek?: number;
}

let preSelectedDate: dayjs.Dayjs = null;

const useTimetable = ({ onRequestUpdate }: { onRequestUpdate: (week: number) => void }) => {
  const [{ currentDate, currentWeek, selectedDate, selectedWeek }, setTimetable] =
    useState<TimetableState>(
      (() => {
        const currentDate = dayjs().startOf('day');
        const currentWeek = getEducationWeekByDate(currentDate);

        return {
          currentDate,
          currentWeek,
          selectedDate: currentDate.clone(),
          selectedWeek: currentWeek,
        };
      })()
    );

  const updateData = (weekInfo: WeekInfo) => {
    if (preSelectedDate) {
      setTimetable((prev) => ({
        ...prev,
        selectedDate: preSelectedDate,
        selectedWeek: weekInfo.selected,
      }));
      preSelectedDate = null;
    } else {
      const weekDiff = weekInfo.selected - selectedWeek;
      const updatedDate = selectedDate.clone().add(weekDiff, 'week');
      setTimetable((prev) => ({
        ...prev,
        selectedDate: updatedDate,
        selectedWeek: weekInfo.selected,
      }));
    }
  };

  const onDatePress = (date: dayjs.Dayjs) => {
    const weekDiff = date.startOf('isoWeek').diff(selectedDate.startOf('isoWeek'), 'week');
    if (weekDiff === 0) {
      setTimetable((prev) => ({ ...prev, selectedDate: date }));
      return;
    }

    const week = getEducationWeekByDate(date);
    onRequestUpdate(week);
    preSelectedDate = date;
  };

  return { currentDate, currentWeek, selectedDate, selectedWeek, updateData, onDatePress };
};

export default useTimetable;
