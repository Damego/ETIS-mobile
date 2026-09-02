import PagerView, { type PagerViewRef, type PageScrollStateChangedEvent } from '@expo/ui/community/pager-view';
import React, { forwardRef } from 'react';
import {
  NativeSyntheticEvent, ScrollView, StyleSheet
} from 'react-native';

import NoPairs from '~/components/NoPairs';
import { checkAllowedPairRender } from '~/components/timetable/checkAllowedPairRender';
import { useAppSelector } from '~/hooks';
import { ITimeTableDay } from '~/models/timeTable';

import Pair from './Pair';

interface TimetablePagesProps {
  days: ITimeTableDay[];
  dayNumber: number;
  onPagePress: (pageNumber: number) => void;
  onPagerScrollStateChange?: (state: PagerScrollState) => void;
}

export type PagerScrollState = 'idle' | 'dragging' | 'settling';

const Page = ({ day }: { day: ITimeTableDay }) => {
  const { showGapsBetweenPairs, showEmptyPairs } = useAppSelector(
    (state) => state.settings.config.ui
  );
  let didRenderFirstPair = false;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.pairsList}
      showsVerticalScrollIndicator={false}
    >
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
    </ScrollView>
  );
};

const TimetablePages = forwardRef<PagerViewRef, TimetablePagesProps>(
  ({ days, dayNumber, onPagePress, onPagerScrollStateChange }, ref) => {
    const handlePageSelected = (event: NativeSyntheticEvent<Readonly<{ position: number }>>) =>
      onPagePress(event.nativeEvent.position - dayNumber);

    const handleScrollStateChanged = (event: PageScrollStateChangedEvent) => {
      onPagerScrollStateChange?.(event.nativeEvent.pageScrollState);
    };

    return (
      <PagerView
        ref={ref}
        initialPage={dayNumber}
        style={{ flex: 1 }}
        onPageSelected={handlePageSelected}
        onPageScrollStateChanged={handleScrollStateChanged}
      >
        {days.map((day, index) => (
          <Page day={day} key={index} />
        ))}

        {/* Воскресенья нет в данных */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.pairsList}
          showsVerticalScrollIndicator={false}
        >
          <NoPairs />
        </ScrollView>
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
