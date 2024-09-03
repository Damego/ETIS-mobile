import React, { useState } from 'react';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import TimetableContainer from '~/components/timetable/TimetableContainer';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import useTimetable from '~/hooks/useTimetable';
import { RequestType } from '~/models/results';
import { ITeacher } from '~/models/timeTable';
import { EducationStackScreenProps } from '~/navigation/types';

import TeacherMenu from './TeacherMenu';

const CathedraTimetable = ({ route }: EducationStackScreenProps<'CathedraTimetable'>) => {
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
        cathedraId: route.params.cathedraId,
        teacherId: route.params.teacherId,
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

  const onTeacherSelect = (teacher: ITeacher) => {
    setCurrentTeacher(teacher);
  };

  if (!isLoading && (!data || !data.timetable || !data.timetable.length)) return <NoData />;

  const teacherTimetable = data
    ? data.timetable.find((timetable) => timetable.teacher.id === currentTeacher?.id) ||
      data.timetable[0]
    : undefined;

  return (
    <Screen onUpdate={refresh}>
      {teacherTimetable && (
        <TeacherMenu
          currentTeacher={teacherTimetable.teacher}
          timetable={data.timetable}
          onSelect={onTeacherSelect}
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
