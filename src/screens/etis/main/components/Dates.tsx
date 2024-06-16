import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Text from '~/components/Text';
import { useTimetableContext } from '~/context/timetableContext';
import { useGlobalStyles } from '~/hooks';
import { useAppTheme } from '~/hooks/theme';
import weekday from 'dayjs/plugin/weekday';

const Dates = ({
  selectedDate,
  onDatePress,
}: {
  selectedDate: dayjs.Dayjs;
  onDatePress: (date: dayjs.Dayjs) => void;
}) => {
  const { currentDate } = useTimetableContext();
  const week = selectedDate.startOf('week');
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.daysListContainer}>
      {Array.from(Array(7)).map((_, index) => {
        const day = week.clone().add(index, 'day');
        const isCurrentDay = selectedDate.weekday() === index;
        let containerStyle: StyleProp<ViewStyle>;
        if (isCurrentDay) {
          containerStyle = [
            styles.selectedDayContainer,
            { borderColor: theme.colors.primaryContrast },
            globalStyles.primaryBackgroundColor,
          ];
        } else if (day.diff(currentDate, 'day') === 0) {
          containerStyle = [styles.dayContainer, { borderColor: theme.colors.primary }];
        } else {
          containerStyle = [styles.dayContainer, { borderColor: theme.colors.primaryContrast }];
        }

        return (
          <TouchableOpacity
            onPress={() => onDatePress(day)}
            style={containerStyle}
            key={index.toString()}
          >
            <Text
              style={
                isCurrentDay
                  ? [globalStyles.primaryContrastText, styles.selectedDayWeekText]
                  : [styles.dayWeekText]
              }
            >
              {day.format('dd').toUpperCase()}
            </Text>
            <Text style={isCurrentDay ? styles.selectedDayNumberText : styles.dayNumberText}>
              {day.format('D')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Dates;

const styles = StyleSheet.create({
  daysListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2%',
  },
  dayContainer: {
    paddingVertical: 14,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 40,
  },
  selectedDayContainer: {
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  selectedDayWeekText: {
    fontWeight: '500',
  },
  dayWeekText: {
    fontWeight: '500',
  },
  selectedDayNumberText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dayNumberText: {
    fontSize: 24,
    fontWeight: '500',
  },
});
