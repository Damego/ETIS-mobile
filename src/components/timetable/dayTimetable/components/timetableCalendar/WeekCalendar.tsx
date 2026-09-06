import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import DayButton from '~/components/timetable/dayTimetable/components/timetableCalendar/DayButton';
import WeekNavigation from '~/components/timetable/dayTimetable/components/timetableCalendar/WeekNavigation';
import { DatePressT } from '~/hooks/useTimetable';

const WeekCalendar = ({
  selectedDate,
  currentDate,
  onDatePress,
  selectedWeek,
  currentWeek,
  firstWeek,
  lastWeek,
  skipSunday,
}: {
  readonly selectedDate: dayjs.Dayjs;
  readonly currentDate: dayjs.Dayjs;
  readonly onDatePress: DatePressT;
  readonly selectedWeek: number;
  readonly currentWeek?: number;
  readonly firstWeek?: number;
  readonly lastWeek?: number;
  // Не показывать воскресенье в свёрнутом недельном календаре (настройка «Пропускать воскресенье»)
  readonly skipSunday?: boolean;
}) => {
  const week = selectedDate.startOf('week');

  const handlePrevPress = () => {
    onDatePress({ week: selectedWeek - 1 });
  };

  const handleNextPress = () => {
    onDatePress({ week: selectedWeek + 1 });
  };

  const handleMainPress = () => {
    onDatePress({ date: currentDate });
  };

  return (
    <View style={styles.calendarContainer}>
      <WeekNavigation
        selectedWeek={selectedWeek}
        selectedDate={selectedDate}
        currentWeek={currentWeek}
        firstWeek={firstWeek}
        lastWeek={lastWeek}
        onPrevPress={handlePrevPress}
        onNextPress={handleNextPress}
        onMainPress={handleMainPress}
      />

      <View style={styles.daysListContainer}>
        {/* Неделя начинается с понедельника (ru-локаль dayjs, App.tsx),
            воскресенье — последний день (смещение 6). skipSunday просто
            не рендерит его; position остаётся индексом weekday() 0-6. */}
        {Array.from(Array(skipSunday ? 6 : 7)).map((_, index) => (
          <DayButton
            key={index}
            dayDate={week.clone().add(index, 'day')}
            currentDate={currentDate}
            selectedDate={selectedDate}
            position={index}
            onPress={(date) => onDatePress({ date })}
          />
        ))}
      </View>
    </View>
  );
};

export default React.memo(WeekCalendar);

const styles = StyleSheet.create({
  calendarContainer: {
    marginTop: '2%',
  },
  daysListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2%',
  },
});
