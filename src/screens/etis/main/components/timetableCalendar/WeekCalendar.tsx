import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DayButton from '~/screens/etis/main/components/timetableCalendar/DayButton';
import WeekNavigation from '~/screens/etis/main/components/timetableCalendar/WeekNavigation';

const WeekCalendar = ({
  selectedDate,
  currentDate,
  onDatePress,
  selectedWeek,
}: {
  selectedDate: dayjs.Dayjs;
  currentDate: dayjs.Dayjs;
  onDatePress: (date: dayjs.Dayjs) => void;
  selectedWeek: number;
}) => {
  const week = selectedDate.startOf('week');

  const handlePrevPress = () => {
    onDatePress(selectedDate.clone().add(-1, 'week'));
  };

  const handleNextPress = () => {
    onDatePress(selectedDate.clone().add(1, 'week'));
  };

  const handleMainPress = () => {
    onDatePress(currentDate);
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
            onPress={onDatePress}
          />
        ))}
      </View>
    </View>
  );
};

export default WeekCalendar;

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
