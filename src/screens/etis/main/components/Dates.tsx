import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '~/components/Text';
import { useTimetableContext } from '~/context/timetableContext';
import { useAppTheme } from '~/hooks/theme';

const Dates = ({
  selectedDate,
  onDatePress,
  onPrevWeek,
  onNextWeek,
}: {
  selectedDate: dayjs.Dayjs;
  onDatePress: (date: dayjs.Dayjs) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}) => {
  const { currentDate } = useTimetableContext();
  const week = selectedDate.startOf('week');
  const theme = useAppTheme();

  return (
    <View style={styles.daysListContainer}>
      <TouchableOpacity style={styles.arrow} onPress={onPrevWeek}>
        <AntDesign name={'left'} color={theme.colors.primary} size={20} />
      </TouchableOpacity>

      {Array.from(Array(6)).map((_, index) => {
        const day = week.clone().add(index, 'day');
        const isCurrentDay = selectedDate.day() - 1 === index;
        let containerStyle;
        if (isCurrentDay) {
          containerStyle = styles.selectedDayContainer;
        } else if (day.diff(currentDate, 'day') === 0) {
          containerStyle = [
            styles.dayContainer,
            { borderWidth: 2, borderRadius: 6, borderColor: theme.colors.primary },
          ];
        } else {
          containerStyle = styles.dayContainer;
        }

        return (
          <TouchableOpacity
            onPress={() => onDatePress(day)}
            style={containerStyle}
            key={index.toString()}
          >
            <Text style={isCurrentDay ? styles.selectedDayWeekText : styles.dayWeekText}>
              {day.format('dd').toUpperCase()}
            </Text>
            <Text style={isCurrentDay ? styles.selectedDayNumberText : styles.dayNumberText}>
              {day.format('D')}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.arrow} onPress={onNextWeek}>
        <AntDesign name={'right'} color={theme.colors.primary} size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default Dates;

const styles = StyleSheet.create({
  arrow: {
    paddingHorizontal: '1%',
    paddingVertical: '2%',
  },
  daysListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2%',
  },
  dayContainer: {
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayContainer: {
    backgroundColor: '#c62e3e', // todo
    borderRadius: 6,
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayWeekText: {
    color: '#FFFFFF',
  },
  dayWeekText: {},
  selectedDayNumberText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dayNumberText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
