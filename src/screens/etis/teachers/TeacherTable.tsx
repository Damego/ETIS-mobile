import React, { useMemo, useRef, useState } from 'react';

import BottomSheetModal from '~/components/BottomSheetModal';
import LoadingScreen from '~/components/LoadingScreen';
import NoData from '~/components/NoData';
import Screen from '~/components/Screen';
import { useClient } from '~/data/client';
import useQuery from '~/hooks/useQuery';
import { ITeacher } from '~/models/teachers';
import TeacherBottomSheet from '~/screens/etis/teachers/TeacherBottomSheet';

import TeacherCard from './TeacherCard';

const groupTeachers = (teachers: ITeacher[]) => {
  if (!teachers) return;

  const dataGrouped = {};
  teachers.forEach((teacher) => {
    teacher.subjects.forEach((subject) => {
      if (dataGrouped[subject.discipline]) {
        dataGrouped[subject.discipline].push(teacher);
      } else {
        dataGrouped[subject.discipline] = [teacher];
      }
    });
  });

  return Object.entries<ITeacher[]>(dataGrouped);
};

const TeacherTable = () => {
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getTeacherData,
  });
  const modalRef = useRef<BottomSheetModal | undefined>(undefined);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const grouped = useMemo(() => groupTeachers(data), [data]);

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;
  if (!data.length) return <NoData text={'Список преподавателей пуст'} onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      {grouped.map(([discipline, teachers]) => (
        <TeacherCard
          discipline={discipline}
          teachers={teachers}
          key={discipline}
          onPress={(teacher) => {
            setSelectedTeacher(teacher);
            modalRef.current.present();
          }}
        />
      ))}
      <TeacherBottomSheet ref={modalRef} teacher={selectedTeacher} />
    </Screen>
  );
};

export default TeacherTable;
