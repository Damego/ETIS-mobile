import PagerView from '@expo/ui/community/pager-view';
import React, { forwardRef } from 'react';
import {
  NativeSyntheticEvent, ScrollView, StyleSheet
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  let didRenderFirstPair = false;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.pairsList,
        { paddingBottom: Math.max(insets.bottom + 60, 80) },
      ]}
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

const TimetablePages = forwardRef<PagerView, TimetablePagesProps>(
  ({ days, dayNumber, onPagePress }, ref) => {
    const insets = useSafeAreaInsets();
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
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.pairsList,
            { paddingBottom: Math.max(insets.bottom + 60, 80) },
          ]}
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
