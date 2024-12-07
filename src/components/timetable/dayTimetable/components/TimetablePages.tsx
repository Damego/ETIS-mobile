import React, { forwardRef } from 'react';
import { NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { checkAllowedPairRender } from '~/components/timetable/checkAllowedPairRender';
import { useAppSelector } from '~/hooks';
import { ITimeTableDay } from '~/models/timeTable';
import NoPairs from '~/screens/etis/main/components/NoPairs';

import Pair from './Pair';

interface TimetablePagesProps {
  days: ITimeTableDay[];
  dayNumber: number;
  onPagePress: (pageNumber: number) => void;
}

const Page = ({ day }: { day: ITimeTableDay }) => {
  const { showGapsBetweenPairs, showEmptyPairs } = useAppSelector(
    (state) => state.settings.config.ui
  );
  let didRenderFirstPair = false;

  return (
    <View style={styles.pairsList}>
      {!day.pairs.length && <NoPairs />}
      {day.pairs.map((pair) => {
        if (
          checkAllowedPairRender(pair, didRenderFirstPair, showGapsBetweenPairs, showEmptyPairs)
        ) {
          didRenderFirstPair = true;
          return <Pair pair={pair} key={pair.position} />;
        }
        return null;
      })}
    </View>
  );
};

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
          <Page day={day} key={index} />
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
