import React, { useState } from 'react';
import { LoadingContainer } from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import DayTimetable from '~/components/timetable/DayTimetable';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import useTimetable from '~/hooks/useTimetable';
import { RequestType } from '~/models/results';
import { ITeacher } from '~/models/timeTable';
import { EducationStackScreenProps } from '~/navigation/types';

import TeacherMenu from './TeacherMenu';

const CathedraTimetable = ({ route }: EducationStackScreenProps<'CathedraTimetable'>) => {
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
  });

  const [currentTeacher, setCurrentTeacher] = useState<ITeacher>();

  const onTeacherSelect = (teacher: ITeacher) => {
    setCurrentTeacher(teacher);
  };

  if (!data || !data.timetable || !data.timetable.length) return <NoData />;

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
      <DayTimetable
        timetable={teacherTimetable}
        currentDate={timetable.currentDate}
        currentWeek={timetable.currentWeek}
        selectedDate={timetable.selectedDate}
        selectedWeek={timetable.selectedWeek}
        onDatePress={timetable.onDatePress}
        isLoading={isLoading && !data}
        loadingComponent={() => <LoadingContainer />}
      />
    </Screen>
  );
};

export default CathedraTimetable;
