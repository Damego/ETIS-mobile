import dayjs from 'dayjs';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useTimetableContext } from '~/context/timetableContext';
import MonthCalendar from '~/components/timetable/dayTimetable/components/timetableCalendar/MonthCalendar';
import WeekCalendar from '~/components/timetable/dayTimetable/components/timetableCalendar/WeekCalendar';

type TimetableCalendarModes = 'week' | 'month';

const TimetableCalendar = ({
  periodStartDate,
  periodEndDate,
  onDatePress,
}: {
  periodStartDate: dayjs.Dayjs;
  periodEndDate: dayjs.Dayjs;
  onDatePress: (date: dayjs.Dayjs) => void;
}) => {
  const { selectedDate, currentDate, selectedWeek } = useTimetableContext();
  const [mode, setMode] = useState<TimetableCalendarModes>('week');

  const setCalendarMode = (mode: TimetableCalendarModes) => setMode(mode);

  const gesture = Gesture.Pan().onEnd((event) => {
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
            onDatePress={onDatePress}
            selectedWeek={selectedWeek}
          />
        ) : (
          <MonthCalendar
            date={selectedDate}
            periodStartDate={periodStartDate}
            periodEndDate={periodEndDate}
            onDatePress={onDatePress}
          />
        )}
      </View>
    </GestureDetector>
  );
};

export default TimetableCalendar;
