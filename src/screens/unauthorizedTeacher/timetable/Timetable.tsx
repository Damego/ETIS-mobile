import React, { useEffect } from 'react';
import CenteredText from '~/components/CenteredText';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import DayTimetable from '~/components/timetable/DayTimetable';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimetable from '~/hooks/useTimetable';
import { RequestType } from '~/models/results';
import { UnauthorizedTeacherStackScreenProps } from '~/navigation/types';

const Timetable = ({ navigation }: UnauthorizedTeacherStackScreenProps) => {
  const teacherId = useAppSelector((state) => state.account.teacher.id);
  const client = useClient();

  const { data, isLoading, refresh, update } = useQuery({
    method: client.getCathedraTimetable,
    payload: {
      data: {
        teacherId,
        week: 33,
      },
      requestType: RequestType.tryFetch,
    },
    after: (result) => {
      timetable.updateData(result.data.timetable[0].weekInfo);
    },
  });

  const timetable = useTimetable({
    onRequestUpdate: (week) => update({ data: { week, teacherId } }),
  });

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => <></> });
  }, []);

  if (!data || !data.timetable?.length) {
    return (
      <Screen>
        <CenteredText>Расписания нет</CenteredText>
      </Screen>
    );
  }

  return (
    <Screen onUpdate={refresh}>
      <DayTimetable
        timetable={data.timetable[0]}
        currentDate={timetable.currentDate}
        currentWeek={timetable.currentWeek}
        onDatePress={timetable.onDatePress}
        selectedDate={timetable.selectedDate}
        isLoading={isLoading}
        loadingComponent={() => <LoadingContainer />}
      />
    </Screen>
  );
};

export default Timetable;
