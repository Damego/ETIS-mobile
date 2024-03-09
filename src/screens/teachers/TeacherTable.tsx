import React, { useMemo } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import useQuery from '../../hooks/useQuery';
import TeacherCard from './TeacherCard';
import { ITeacher } from '../../models/teachers';

const groupTeachers = (data: ITeacher[]) => {
  if (!data) return;

  const dataGrouped = {};
  data.forEach((val) => {
    if (dataGrouped[val.subject.discipline]) {
      dataGrouped[val.subject.discipline].push(val);
    } else {
      dataGrouped[val.subject.discipline] = [val];
    }
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
