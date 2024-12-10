import React, { useState } from 'react';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import TeachersBottomSheet from '~/components/education/cathedraTimetable/TeachersBottomSheet';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import useRoutePayload from '~/hooks/useRoutePayload';
import useTimetable from '~/hooks/useTimetable';
import { RequestType } from '~/models/results';
import { ITeacher } from '~/models/timeTable';

const CathedraTimetable = () => {
  const { cathedraId, teacherId } = useRoutePayload<{ cathedraId: string; teacherId: number }>();
  const [currentTeacher, setCurrentTeacher] = useState<ITeacher>();

  const client = useClient();
  const timetable = useTimetable({
    onRequestUpdate: (week) =>
      update({ data: { ...initialPayload, week }, requestType: RequestType.tryFetch }),
  });
  const { data, isLoading, refresh, update, initialPayload } = useQuery({
    method: client.getCathedraTimetable,
    payload: {
      data: {
        cathedraId,
        teacherId,
        week: timetable.currentWeek,
      },
      requestType: RequestType.forceFetch,
    },
    after: (result) => {
      const $timetable = result.data
        ? result.data.timetable.find((timetable) => timetable.teacher.id === currentTeacher?.id) ||
          result.data.timetable[0]
        : undefined;
      if (!$timetable) return;

      timetable.updateData($timetable.weekInfo);
    },
  });

  const onTeacherSelect = (teacherId: string) => {
    setCurrentTeacher(data.timetable.find((tt) => tt.teacher.id === teacherId).teacher);
  };

  if (!isLoading && (!data || !data.timetable || !data.timetable.length)) return <NoData />;

  const teacherTimetable = data
    ? data.timetable.find((timetable) => timetable.teacher.id === currentTeacher?.id) ||
      data.timetable[0]
    : undefined;

  return (
    <Screen onUpdate={refresh}>
      {data?.timetable?.length > 1 && (
        <TeachersBottomSheet
          selectedTeacher={teacherTimetable.teacher}
          timetable={data.timetable}
          onTeacherSelect={onTeacherSelect}
        />
      )}
      <TimetableContainer
        data={teacherTimetable}
        timetable={timetable}
        isLoading={isLoading}
        loadingComponent={() => <LoadingContainer />}
      />
    </Screen>
  );
};

export default CathedraTimetable;
