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
}: {
  selectedDate: dayjs.Dayjs;
  currentDate: dayjs.Dayjs;
  onDatePress: DatePressT;
  selectedWeek: number;
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
      />

      <View style={styles.daysListContainer}>
        {Array.from(Array(7)).map((_, index) => (
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
