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
  selectedDate: dayjs.Dayjs;
  currentDate: dayjs.Dayjs;
  onDatePress: DatePressT;
  selectedWeek: number;
  currentWeek?: number;
  firstWeek?: number;
  lastWeek?: number;
  // Не показывать воскресенье в свёрнутом недельном календаре (настройка «Пропускать воскресенье»)
  skipSunday?: boolean;
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
        onPrevPress={handlePrevPress}
        onNextPress={handleNextPress}
        onMainPress={handleMainPress}
        selectedWeek={selectedWeek}
        selectedDate={selectedDate}
        currentWeek={currentWeek}
        firstWeek={firstWeek}
        lastWeek={lastWeek}
      />

      <View style={styles.daysListContainer}>
        {/* Неделя начинается с воскресенья (dayjs startOf('week')), поэтому
            skipSunday исключает именно его — сдвигаем старт недели на понедельник */}
        {Array.from(Array(7))
          .map((_, index) => (skipSunday ? index + 1 : index))
          .map((dayOffset) => (
            <DayButton
              key={dayOffset}
              dayDate={week.clone().add(dayOffset, 'day')}
              currentDate={currentDate}
              selectedDate={selectedDate}
              position={dayOffset}
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
