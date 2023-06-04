import React, { useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setAuthorizing } from '../../redux/reducers/authSlice';
import SessionCard from './SessionCard';
import { cacheTeachPlanData, getTeachPlanData } from '../../data/teachPlan';
import { ToastAndroid } from 'react-native';
import { ISessionTeachPlan } from '../../models/teachPlan';

const ShortTeachPlan = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<ISessionTeachPlan[]>(null);

  const loadData = async (force?: boolean) => {
    const result = await getTeachPlanData({useCache: true, useCacheFirst: !force});

    if (!result.data) {
      ToastAndroid.show('Упс... Нет данных для отображения', ToastAndroid.LONG);
      return;
    }

    if (result.isLoginPage) {
      dispatch(setAuthorizing(true));
      return;
    }

    setData(result.data);
    if (result.fetched) {
      cacheTeachPlanData(result.data);
    }
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (!data) return <LoadingScreen />;

  return (
    <Screen onUpdate={() => loadData(true)}>
      {data.map((session) => (
        <SessionCard data={session} key={session.stringSession} />
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
