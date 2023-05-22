import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { parseTimeTable } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/authSlice';
import { httpClient } from '../../utils';

import {ITimeTable} from '../../parser/timeTable';
import DayArray from './DayArray';

const TimeTable = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ITimeTable>(null);
  const [week, changeWeek] = useState<number>(null);

  const loadData = async () => {
    setLoading(true);
    let html: string;
    if (week !== null) {
      html = await httpClient.getTimeTable({ week });
    } else {
      html = await httpClient.getTimeTable();
    }
    if (!html) {
      return;
    }
    if (isLoginPage(html)) {
      dispatch(signOut({ autoAuth: true }));
      return;
    }
    const parsedData = parseTimeTable(html);
    setData(parsedData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [week]);

  if (!data || isLoading) return <LoadingScreen headerText="Расписание" />;

  return (
    <Screen headerText="Расписание" onUpdate={loadData}>
      <PageNavigator
        firstPage={data.firstWeek}
        lastPage={data.lastWeek}
        currentPage={data.currentWeek}
        onPageChange={changeWeek}
      />

      <DayArray data={data.days} />
    </Screen>
  );
};

export default TimeTable;
