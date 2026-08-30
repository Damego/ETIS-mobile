import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import BellScheduleButton from '~/components/timetable/buttons/BellScheduleButton';
import DisciplineTasksButton from '~/components/timetable/buttons/DisciplineTasksButton';
import ToggleModeButton from '~/components/timetable/buttons/ToggleModeButton';
import type { PagerScrollState } from '~/components/timetable/dayTimetable/components/TimetablePages';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimetable from '~/hooks/useTimetable';
import useTimeTableQuery from '~/hooks/useTimeTableQuery';
import { RequestType } from '~/models/results';

export const Timetable = () => {
  const client = useClient();
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);

  const timetable = useTimetable({
    skipSunday,
    onRequestUpdate: (week) => loadWeek(week),
  });

  const {
    data,
    isLoading,
    loadWeek,
    refresh,
  } = useTimeTableQuery({
    week: timetable.selectedWeek,
    afterCallback: (result) => {
      timetable.updateData(result.data.weekInfo);
    },
  });
  const { data: teachersData, isLoading: teachersIsLoading } = useQuery({
    method: client.getTeacherData,
    payload: {
      requestType: RequestType.tryCache,
    },
  });

  // Пока пейджер дней перелистывается (dragging/settling), блокируем
  // pull-to-refresh, чтобы случайная вертикальная составляющая свайпа
  // не запускала обновление расписания
  const [pagerActive, setPagerActive] = useState(false);

  const handlePagerScrollStateChange = (state: PagerScrollState) => {
    setPagerActive(state !== 'idle');
  };

  return (
    <Screen onUpdate={refresh} containerStyle={{ paddingBottom: 0 }} refreshEnabled={!pagerActive}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Расписание</Text>
        <View style={styles.titleIconsContainer}>
          <ToggleModeButton />
          <BellScheduleButton />
          <DisciplineTasksButton />
        </View>
      </View>

      <TimetableContainer
        data={data}
        timetable={timetable}
        teachers={teachersData}
        isLoading={!data && (isLoading || teachersIsLoading)}
        loadingComponent={() => <LoadingContainer />}
        onRetry={refresh}
        onPagerScrollStateChange={handlePagerScrollStateChange}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontWeight: '700',
    fontSize: 22,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
});
