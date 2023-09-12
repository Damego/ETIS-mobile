import React from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { useClient } from '../../data/client';
import useQuery from '../../hooks/useQuery';
import { checkSubjectNames } from '../../utils/sentry';
import CalendarSchedule from './CalendarSchedule';
import SessionCard from './SessionCard';

const ShortTeachPlan = () => {
  const client = useClient();
  const { data, isLoading, refresh } = useQuery({
    method: client.getTeachPlanData,
    after: (result) => {
      checkSubjectNames(result.data);
    },
  });

  if (isLoading) return <LoadingScreen onRefresh={refresh} />;
  if (!data) return <NoData onRefresh={refresh} />;
  return (
    <Screen onUpdate={refresh}>
      <CalendarSchedule />

      {data.map((session) => (
        <SessionCard data={session} key={session.stringSession} />
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
