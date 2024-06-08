import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '~/components/Text';
import { useTimetableContext } from '~/context/timetableContext';

const Dates = () => {
  const { currentDate } = useTimetableContext();
  const week = currentDate.startOf('week');

  return (
    <View style={styles.daysListContainer}>
      {Array.from(Array(6)).map((_, index) => {
        const day = week.clone().add(index, 'day');
        const isCurrentDay = currentDate.day() - 1 === index;

        return (
          <View
            style={isCurrentDay ? styles.currentDayContainer : styles.dayContainer}
            key={index.toString()}
          >
            <Text style={isCurrentDay ? styles.currentDayText : styles.dayText}>
              {day.format('dd').toUpperCase()}
            </Text>
            <Text style={isCurrentDay ? styles.currentDayText : styles.dayText}>
              {day.format('D')}
            </Text>
          </View>
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
    marginHorizontal: '2%',
    marginTop: '2%',
  },
  dayContainer: {
    paddingVertical: '2%',
    paddingHorizontal: '4%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentDayContainer: {
    backgroundColor: '#c62e3e',
    borderRadius: 10,
    paddingVertical: '2%',
    paddingHorizontal: '4%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentDayText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
