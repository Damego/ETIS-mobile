import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import NoData from '../../components/NoData';
import Screen from '../../components/Screen';
import { getWrappedClient } from '../../data/client';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { GetResultType, RequestType } from '../../models/results';
import { ISessionTeachPlan } from '../../models/teachPlan';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import CalendarSchedule from './CalendarSchedule';
import SessionCard from './SessionCard';

const ShortTeachPlan = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<ISessionTeachPlan[]>(null);
  const [isLoading, setLoading] = useState(false);
  const client = getWrappedClient();

  const loadData = async (force?: boolean) => {
    setLoading(true);
    const result = await client.getTeachPlanData({
      requestType: force ? RequestType.tryFetch : RequestType.tryCache,
    });

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    if (!result.data) {
      if (!data) setLoading(false);
      ToastAndroid.show('Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    setData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (isLoading) return <LoadingScreen onRefresh={loadData} />;
  if (!data) return <NoData onRefresh={() => loadData(true)} />;

  return (
    <Screen onUpdate={() => loadData(true)}>
      <CalendarSchedule />

      {data.map((session) => (
        <SessionCard data={session} key={session.stringSession} />
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
