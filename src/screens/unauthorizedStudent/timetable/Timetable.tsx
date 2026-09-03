import { useQuery as useTanstackQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { getPeriodWeek, isPsutechAvailable } from '~/api/psutech/api';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import Text from '~/components/Text';
import BellScheduleButton from '~/components/timetable/buttons/BellScheduleButton';
import DisciplineTasksButton from '~/components/timetable/buttons/DisciplineTasksButton';
import ToggleModeButton from '~/components/timetable/buttons/ToggleModeButton';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimetable from '~/hooks/useTimetable';
import useTimetableSync from '~/hooks/useTimetableSync';
import { RequestType } from '~/models/results';
import { UnauthorizedTeacherStackScreenProps } from '~/navigation/types';
import {
  getCurrentEducationYear,
  getFirstEducationWeekDate,
  getLastEducationWeekDate,
  getStudentYear,
} from '~/utils/datetime';
import { fontSize } from '~/utils/texts';

const Timetable = ({ navigation }: UnauthorizedTeacherStackScreenProps) => {
  const { group } = useAppSelector((state) => state.account.student);
  const { skipSunday } = useAppSelector((state) => state.settings.config.ui);
  const client = useClient();

  const { data: periodWeek } = useTanstackQuery({
    queryFn: () => getPeriodWeek(group.period_type, getCurrentEducationYear()),
    queryKey: ['periods'],
  });

  const { data, isLoading, refresh, update, initialPayload } = useQuery({
    method: client.getGroupTimetable,
    payload: {
      data: {
        facultyId: group.faculty.id,
        groupId: group.id,
        course: getStudentYear(group.year),
        year: getCurrentEducationYear(),
        // Будет заполнено позже
        period: 0,
        week: 0,
      },
      requestType: RequestType.tryFetch,
    },
    skipInitialGet: true,
  });

  const loadData = (week: number) => {
    if (!periodWeek) return;

    // Период обучения, в который попадает запрошенная неделя
    // (номер периода = индекс в periods_to_weeks + 1)
    const periodIndex = periodWeek.periods_to_weeks.findIndex(
      ([start, end]) => start <= week && week <= end
    );
    if (periodIndex === -1) return;

    const payload = {
      data: {
        ...initialPayload,
        period: periodIndex + 1,
        week,
      },
      requestType: RequestType.tryFetch,
    };
    update(payload);
  };

  useEffect(() => {
    if (periodWeek) {
      loadData(timetable.currentWeek);
    }
  }, [periodWeek]);

  const timetable = useTimetable({
    skipSunday,
    onRequestUpdate: loadData,
  });
  useTimetableSync(timetable, data, ($data) => $data?.weekInfo);

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => <></> });
  }, []);

  if (!periodWeek && isPsutechAvailable() === false) {
    return (
      <Screen onUpdate={refresh}>
        <Text style={[fontSize.medium, { alignSelf: 'center', marginTop: 20 }]} colorVariant={'text2'}>
          Сервис временно недоступен.{'\n'}Попробуйте позже.
        </Text>
      </Screen>
    );
  }

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
        data={data}
        timetable={timetable}
        isLoading={isLoading}
        loadingComponent={() => <LoadingContainer />}
        startDate={getFirstEducationWeekDate()}
        endDate={getLastEducationWeekDate()}
        firstWeek={1}
        lastWeek={53}
      />
    </Screen>
  );
};

export default Timetable;

const styles = StyleSheet.create({
  titleText: {
    fontWeight: '700',
    ...fontSize.slarge,
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
