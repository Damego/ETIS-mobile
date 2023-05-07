import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-get-random-values';

import LoadingPage from '../../components/LoadingPage';
import Screen from '../../components/Screen';
import { GLOBAL_STYLES } from '../../styles/styles';
import { vars } from '../../utils/vars';
import { Day, EmptyDay } from './Day';
import WeekNavigation from './WeekNavigator';

const TimeTablePage = () => {
  const [data, setData] = useState(null);
  const [week, changeWeek] = useState(null);

  const loadData = async () => {
    let html;
    if (week != null) {
      html = await vars.httpClient.getTimeTable({ week });
    } else {
      html = await vars.httpClient.getTimeTable();
    }

    if (!html) {
      console.warn('failed to load timetable');
      return;
    }
    const parsedData = vars.parser.parseTimeTable(html);
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, [week, setData]);

  if (!data) return <LoadingPage />;

  return (
    <Screen headerText="Расписание" onUpdate={loadData}>
      <WeekNavigation
        firstWeek={data.firstWeek}
        lastWeek={data.lastWeek}
        currentWeek={data.currentWeek}
        onWeekChange={(selectedWeek) => changeWeek(selectedWeek)}
      />

      <View>
        {data.days.map((day) =>
          day.lessons.length === 0 ? (
            <EmptyDay key={day.date} data={day} />
          ) : (
            <Day key={day.date} data={day} />
          )
        )}
      </View>
    </Screen>
  );
};

export default TimeTablePage;
