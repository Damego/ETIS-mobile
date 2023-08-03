import React, { useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ISessionTeachPlan } from '../../models/teachPlan';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import SessionCard from './SessionCard';
import { getWrappedClient } from '../../data/client';
import { GetResultType, RequestType } from '../../models/results';

const ShortTeachPlan = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<ISessionTeachPlan[]>(null);
  const client = getWrappedClient();
  const loadData = async (force?: boolean) => {
    const result = await client.getTeachPlanData({
      requestType: force ? RequestType.tryFetch : RequestType.tryCache,
    });

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    if (result.type === GetResultType.loginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    setData(result.data);
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (!data) return <LoadingScreen onRefresh={loadData} />;

  return (
    <Screen onUpdate={() => loadData(true)}>
      {data.map((session) => (
        <SessionCard data={session} key={session.stringSession} />
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
