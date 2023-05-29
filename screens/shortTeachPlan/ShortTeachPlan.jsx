import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import CardHeaderOut from '../../components/CardHeaderOut';
import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { parseShortTeachPlan } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/reducers/authSlice';
import { httpClient } from '../../utils';
import SessionCard from './SessionCard';

const ShortTeachPlan = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);

  const loadData = async () => {
    const html = await httpClient.getTeachPlan();
    if (!html) return;

    if (isLoginPage(html)) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }

    const loadedData = parseShortTeachPlan(html);
    setData(loadedData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingScreen headerText="Учебный план" />;

  return (
    <Screen headerText="Учебный план" onUpdate={loadData}>
      {data.map((session) => (
        <SessionCard data={session} key={session.trimester} />
      ))}
    </Screen>
  );
};

export default ShortTeachPlan;
