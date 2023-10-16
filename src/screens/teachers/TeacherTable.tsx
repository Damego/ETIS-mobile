import React from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import useQuery from '../../hooks/useQuery';
import TeacherCard from './TeacherCard';

const TeacherTable = () => {
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getTeacherData,
  });

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;
  if (!data.length) return <NoData text={'Список преподавателей пуст'} onRefresh={refresh} />;

  return (
    <Screen onUpdate={refresh}>
      {data.map(([discipline, teachers]) => (
        <TeacherCard discipline={discipline} teachers={teachers} key={discipline} />
      ))}
    </Screen>
  );
};

export default TeacherTable;
