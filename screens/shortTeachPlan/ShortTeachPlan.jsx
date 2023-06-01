import React, { useEffect, useState } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { parseShortTeachPlan } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { setAuthorizing, signOut } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import SessionCard from './SessionCard';

const ShortTeachPlan = () => {
  const dispatch = useAppDispatch();
  const { isAuthorizing } = useAppSelector((state) => state.auth);
  const [data, setData] = useState(null);

  const loadData = async () => {
    const html = await httpClient.getTeachPlan();
    if (!html) return;

    if (isLoginPage(html)) {
      dispatch(setAuthorizing(true));
      return;
    }

    const loadedData = parseShortTeachPlan(html);
    setData(loadedData);
  };

  useEffect(() => {
    if (!isAuthorizing) loadData();
  }, [isAuthorizing]);

  if (!data) return <LoadingScreen />;

  return (
    <Screen onUpdate={loadData}>
      {data.map((session) => (
        <SessionCard data={session} key={session.trimester} />
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
