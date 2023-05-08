import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-get-random-values';

import LoadingScreen from '../../components/LoadingScreen';
import Screen from '../../components/Screen';
import { httpClient, parser } from '../../utils';
import { Day, EmptyDay } from './Day';
import WeekNavigation from './WeekNavigator';

const TimeTablePage = () => {
  const [data, setData] = useState(null);
  const [week, changeWeek] = useState(null);

  const loadData = async () => {
    let html;
    if (week !== null) {
      html = await httpClient.getTimeTable({ week });
    } else {
      html = await httpClient.getTimeTable();
    }

    if (!html) {
      return;
    }
    const parsedData = parser.parseTimeTable(html);
    setData(parsedData);
  };

  useEffect(() => {
    loadData();
  }, [week]);

  if (!data) return <LoadingScreen headerText="Расписание"/>;

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
