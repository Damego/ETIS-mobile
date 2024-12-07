import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import BellScheduleButton from '~/components/timetable/buttons/BellScheduleButton';
import DisciplineTasksButton from '~/components/timetable/buttons/DisciplineTasksButton';
import ToggleModeButton from '~/components/timetable/buttons/ToggleModeButton';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimetable from '~/hooks/useTimetable';
import { RequestType } from '~/models/results';
import { UnauthorizedTeacherStackScreenProps } from '~/navigation/types';

const Timetable = ({ navigation }: UnauthorizedTeacherStackScreenProps) => {
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);
  const teacherId = useAppSelector((state) => state.account.teacher.id);
  const client = useClient();
  const timetable = useTimetable({
    skipSunday,
    onRequestUpdate: (week) => update({ data: { week, teacherId } }),
  });

  const { data, isLoading, refresh, update } = useQuery({
    method: client.getCathedraTimetable,
    payload: {
      data: {
        week: timetable.currentWeek,
        teacherId,
      },
      requestType: RequestType.tryFetch,
    },
    after: (result) => {
      timetable.updateData(result.data.timetable[0].weekInfo);
    },
  });

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => <></> });
  }, []);

  return (
    <Screen onUpdate={refresh}>
      <View style={styles.titleContainer}>
        <View style={styles.titleIconsContainer}>
          <ToggleModeButton />
          <BellScheduleButton />
          <DisciplineTasksButton />
        </View>
      </View>

      <TimetableContainer
        data={data?.timetable?.[0]}
        timetable={timetable}
        isLoading={isLoading}
        loadingComponent={() => <LoadingContainer />}
      />
    </Screen>
  );
};

export default Timetable;

const styles = StyleSheet.create({
  titleText: {
    fontWeight: '700',
    fontSize: 22,
  },
  titleContainer: {
    alignItems: 'flex-end',
  },
  titleIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
});
