import React, { useContext, useEffect, useState } from 'react';
import 'react-native-get-random-values';

import LoadingScreen from '../../components/LoadingScreen';
import PageNavigator from '../../components/PageNavigator';
import Screen from '../../components/Screen';
import AuthContext from '../../context/AuthContext';
import { httpClient, parser } from '../../utils';
import { Day, EmptyDay } from './Day';

const TimeTable = () => {
  const { toggleSignIn } = useContext(AuthContext);
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
    if (parser.isLoginPage(html)) {
      toggleSignIn(true);
      return;
    }
    const parsedData = parser.parseTimeTable(html);
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
        onPageChange={(selectedWeek) => changeWeek(selectedWeek)}
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
