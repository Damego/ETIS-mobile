import PagerView, { type PagerViewRef, type PageScrollStateChangedEvent } from '@expo/ui/community/pager-view';
import React, { forwardRef, useState } from 'react';
import {
  NativeSyntheticEvent, ScrollView, StyleSheet, View
} from 'react-native';

import NoPairs from '~/components/NoPairs';
import { checkAllowedPairRender } from '~/components/timetable/checkAllowedPairRender';
import { useAppSelector } from '~/hooks';
import { ITimeTableDay } from '~/models/timeTable';
import { useBottomNavPadding } from '~/utils/bottomNav';

import Pair from './Pair';

interface TimetablePagesProps {
  readonly days: ITimeTableDay[];
  readonly dayNumber: number;
  readonly onPagePress: (pageNumber: number) => void;
  readonly onPagerScrollStateChange?: (state: PagerScrollState) => void;
}

export type PagerScrollState = 'idle' | 'dragging' | 'settling';

const Page = ({ day }: { readonly day: ITimeTableDay }) => {
  const { showGapsBetweenPairs, showEmptyPairs } = useAppSelector(
    (state) => state.settings.config.ui
  );
  let didRenderFirstPair = false;

  return (
    <ScrollView
      nestedScrollEnabled
      style={{ flex: 1 }}
      contentContainerStyle={styles.pairsList}
      showsVerticalScrollIndicator={false}
      overScrollMode='never'
    >
      {!day.pairs.length && <NoPairs />}
      {day.pairs.map((pair) => {
        if (
          checkAllowedPairRender(pair, didRenderFirstPair, showGapsBetweenPairs, showEmptyPairs)
        ) {
          didRenderFirstPair = true;
          return <Pair key={pair.position} pair={pair} />;
        }
        return null;
      })}
    </ScrollView>
  );
};

// Воскресенья нет в данных — пустая страница
const EMPTY_DAY: ITimeTableDay = { date: '', pairs: [] };

const TimetablePages = forwardRef<PagerViewRef, TimetablePagesProps>(
  ({ days, dayNumber, onPagePress, onPagerScrollStateChange }, ref) => {
    const bottomNavPadding = useBottomNavPadding();
    // Баг «бесконечного расписания»: страницы @expo/ui PagerView — это RNHostView-ноды,
    // сложенные стопкой как обычные Yoga-дети Host-ноды, и каж    // получает фиксированную высоту всего пейджера (пиннинг размера из Compose).дая после первого замера
    // Yoga измеряет контейнер ScrollView по содержимому, поэтому стопка из N страниц
    // раздувает высоту прокрутки на (N−1)×высоту пейджера и разгоняет саму себя через
    // петлю «высота Host → размер пейджера → пиннинг RNHostView → высота Host».
    //
    // Фикс: пейджер позиционируется абсолютно и не участвует в потоке — высоту
    // скролла задаёт только шапка. Нулевой «якорь» в потоке замеряет смещение слота
    // пейджера от верха контейнера, bottom поднят над плавающей навигацией на ту же
    // величину, что и paddingBottom контейнера в Screen (useBottomNavPadding).
    const [pagerTop, setPagerTop] = useState<number | null>(null);

    const handlePageSelected = (event: NativeSyntheticEvent<Readonly<{ position: number }>>) =>
      onPagePress(event.nativeEvent.position - dayNumber);

    const handleScrollStateChanged = (event: PageScrollStateChangedEvent) => {
      onPagerScrollStateChange?.(event.nativeEvent.pageScrollState);
    };

    return (
      <>
        {/* Якорь обязан быть прямым ребёнком scroll-контейнера вместе с пейджером:
            его onLayout.y — это и есть отступ слота пейджера от верха контейнера */}
        <View
          style={styles.pagerAnchor}
          onLayout={(event) => setPagerTop(event.nativeEvent.layout.y)}
        />
        {pagerTop === null ? null : (
          <PagerView
            ref={ref}
            initialPage={dayNumber}
            style={[styles.pager, { top: pagerTop, bottom: bottomNavPadding }]}
            onPageSelected={handlePageSelected}
            onPageScrollStateChanged={handleScrollStateChanged}
          >
            {days.map((day, index) => (
              <Page key={index} day={day} />
            ))}
            <Page day={EMPTY_DAY} />
          </PagerView>
        )}
      </>
    );
  }
);

export default TimetablePages;

const styles = StyleSheet.create({
  pagerAnchor: {
    height: 0,
  },
  pager: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  pairsList: {
    marginTop: '4%',
    gap: 8,
    paddingBottom: 16,
  },
});
