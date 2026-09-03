import dayjs from 'dayjs';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import MonthCalendar from '~/components/timetable/dayTimetable/components/timetableCalendar/MonthCalendar';
import WeekCalendar from '~/components/timetable/dayTimetable/components/timetableCalendar/WeekCalendar';
import { useTimetableContext } from '~/context/timetableContext';

export type TimetableCalendarModes = 'week' | 'month';

const TimetableCalendar = ({
  periodStartDate,
  periodEndDate,
  firstWeek,
  lastWeek,
  onDatePress,
  skipSunday,
}: {
  periodStartDate?: dayjs.Dayjs;
  periodEndDate?: dayjs.Dayjs;
  firstWeek?: number;
  lastWeek?: number;
  // Не показывать воскресенье в свёрнутом недельном календаре (настройка «Пропускать воскресенье»)
  skipSunday?: boolean;
  onDatePress: (
    { date, week }: { date?: dayjs.Dayjs; week?: number },
    mode: TimetableCalendarModes
  ) => void;
}) => {
  const { selectedDate, currentDate, selectedWeek, currentWeek } = useTimetableContext();
  const [mode, setMode] = useState<TimetableCalendarModes>('week');

  const setCalendarMode = (mode: TimetableCalendarModes) => setMode(mode);

  const gesture = Gesture.Pan()
    // Активируем жест только после заметного вертикального движения:
    // горизонтальные свайпы (пейджер дней) и мелкие дрожания пальца
    // не должны переключать режим календаря
    .activeOffsetY([-25, 25])
    .failOffsetX([-25, 25])
    .onEnd((event) => {
      // Переключаем только на быстром, доминантно вертикальном свайпе:
      // медленный drag (например, прокрутка страницы под календарём)
      // не должен менять режим
      const isVertical = Math.abs(event.translationY) > Math.abs(event.translationX);
      if (!isVertical || Math.abs(event.translationY) < 50) return;
      if (Math.abs(event.velocityY) < 500) return;

      if (event.translationY > 0) {
        if (mode !== 'month') runOnJS(setCalendarMode)('month');
      } else if (mode !== 'week') runOnJS(setCalendarMode)('week');
    });

  return (
    <GestureDetector gesture={gesture}>
      <View>
        {mode === 'week' ? (
          <WeekCalendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDatePress={(data) =>
              onDatePress(
                data,
                // date доступен когда юзер нажал на дату, а week при нажатии на стрелочки
                data.date ? 'week' : 'month'
              )
            }
            selectedWeek={selectedWeek ?? 1}
            currentWeek={currentWeek}
            firstWeek={firstWeek}
            lastWeek={lastWeek}
            skipSunday={skipSunday}
          />
        ) : (
          <MonthCalendar
            date={selectedDate}
            periodStartDate={periodStartDate ?? selectedDate}
            periodEndDate={periodEndDate ?? selectedDate}
            onDatePress={(data) => onDatePress(data, 'month')}
          />
        )}
      </View>
    </GestureDetector>
  );
};

export default React.memo(TimetableCalendar);
