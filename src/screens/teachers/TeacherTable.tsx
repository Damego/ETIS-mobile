import React, { useMemo } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import useQuery from '../../hooks/useQuery';
import { ITeacher } from '../../models/teachers';
import TeacherCard from './TeacherCard';

const groupTeachers = (teachers: ITeacher[]) => {
  if (!teachers) return;
  console.log(teachers);

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
  const grouped = useMemo(() => groupTeachers(data), [data]);

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;
  if (!data.length) return <NoData text={'Список преподавателей пуст'} onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      {grouped.map(([discipline, teachers]) => (
        <TeacherCard discipline={discipline} teachers={teachers} key={discipline} />
      ))}
    </Screen>
  );
};

export default TeacherTable;
