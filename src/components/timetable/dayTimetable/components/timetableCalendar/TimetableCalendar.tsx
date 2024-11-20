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
  onDatePress,
}: {
  periodStartDate?: dayjs.Dayjs;
  periodEndDate?: dayjs.Dayjs;
  onDatePress: (
    { date, week }: { date?: dayjs.Dayjs; week?: number },
    mode: TimetableCalendarModes
  ) => void;
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
            onDatePress={(data) =>
              onDatePress(
                data,
                // date доступен когда юзер нажал на дату, а week при нажатии на стрелочки
                data.date ? 'week' : 'month'
              )
            }
            selectedWeek={selectedWeek}
          />
        ) : (
          <MonthCalendar
            date={selectedDate}
            periodStartDate={periodStartDate}
            periodEndDate={periodEndDate}
            onDatePress={(data) => onDatePress(data, 'month')}
          />
        )}
      </View>
    </GestureDetector>
  );
};

export default React.memo(TimetableCalendar);
