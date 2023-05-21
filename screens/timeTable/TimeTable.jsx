import React, { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { useDispatch } from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import { parseTimeTable } from '../../parser';
import { isLoginPage } from '../../parser/utils';
import { signOut } from '../../redux/authSlice';
import { httpClient } from '../../utils';
import { Day, EmptyDay } from './Day';

const TimeTable = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [week, changeWeek] = useState(null);

  const loadData = async () => {
    setLoading(true);
    let html;
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

      {data.days.map((day) =>
        day.lessons.length === 0 ? (
          <EmptyDay key={day.date} data={day} />
        ) : (
          <Day key={day.date} data={day} />
        )
      )}
    </Screen>
  );
};

export default TimeTable;
