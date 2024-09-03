import React, { useEffect } from 'react';
import { LoadingContainer } from '~/components/LoadingScreen';
import Screen from '~/components/Screen';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useClient } from '~/data/client';
import { useAppSelector } from '~/hooks';
import useQuery from '~/hooks/useQuery';
import useTimetable from '~/hooks/useTimetable';
import { RequestType } from '~/models/results';
import { UnauthorizedTeacherStackScreenProps } from '~/navigation/types';

const Timetable = ({ navigation }: UnauthorizedTeacherStackScreenProps) => {
  const teacherId = useAppSelector((state) => state.account.teacher.id);
  const client = useClient();
  const timetable = useTimetable({
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
      <TimetableContainer
        data={data.timetable[0]}
        timetable={timetable}
        isLoading={isLoading}
        loadingComponent={() => <LoadingContainer />}
      />
    </Screen>
  );
};

export default Timetable;
