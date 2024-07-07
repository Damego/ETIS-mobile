import React, { forwardRef } from 'react';
import { NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { ITimeTableDay } from '~/models/timeTable';
import NoPairs from '~/screens/etis/main/components/NoPairs';
import Pair from '~/screens/etis/main/timetable/Pair';

interface TimetablePagesProps {
  days: ITimeTableDay[];
  dayNumber: number;
  onPagePress: (pageNumber: number) => void;
}

const TimetablePages = forwardRef<PagerView, TimetablePagesProps>(
  ({ days, dayNumber, onPagePress }, ref) => {
    const handlePageSelected = (event: NativeSyntheticEvent<Readonly<{ position: number }>>) =>
      onPagePress(event.nativeEvent.position - dayNumber);

    return (
      <PagerView
        ref={ref}
        initialPage={dayNumber}
        style={{ flex: 1 }}
        onPageSelected={handlePageSelected}
      >
        {days.map((day, index) => (
          <View style={styles.pairsList} key={index}>
            {dayNumber === 6 || (!days[dayNumber].pairs.length && <NoPairs />)}
            {day.pairs.map(
              (pair) => !!pair.lessons.length && <Pair pair={pair} key={pair.position} />
            )}
          </View>
        ))}

        {/* Воскресенья нет в данных */}
        <View style={styles.pairsList}>
          <NoPairs />
        </View>
      </PagerView>
    );
  }
);

export default TimetablePages;

const styles = StyleSheet.create({
  pairsList: {
    marginTop: '4%',
    gap: 8,
  },
});
