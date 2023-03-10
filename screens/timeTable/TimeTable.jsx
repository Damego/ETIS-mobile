import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { v4 as uuid4 } from 'uuid';

import LoadingPage from '../../components/LoadingPage';
import { Day, EmptyDay } from './Day';
import WeekNavigation from './WeekNavigator';
import Screen from '../../components/Screen';

import { vars } from '../../utils/vars';
import { GLOBAL_STYLES } from '../../styles/styles';

const TimeTablePage = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);

  /**
   *
   * @param {number | null} week День недели
   */
  const getWeekData = async (week = null) => {
    // TODO: cache data

    let html;
    if (week != null) {
      html = await vars.httpClient.getTimeTable({ week });
    } else {
      html = await vars.httpClient.getTimeTable();
    }
    // TODO: What the fuck why navigation doesn't work?
    // if (vars.parser.isLoginPage(html)) {
    //   navigation.navigate("StackNavigator", {screen: "Authorization"});
    //   return;
    // }

    if (!html) return null;
    return vars.parser.parseTimeTable(html);
  };

  useEffect(() => {
    if (isLoaded) return;

    const wrapper = async () => {
      const res = await getWeekData();
      if (res != null) {
        setLoaded(true);
        setData(res);
      }
    };
    wrapper();
  });

  const changeWeek = async (week) => {
    const res = await getWeekData(week);
    setData(res);
  };

  if (!isLoaded || !data) return <LoadingPage />;

  return (
    <Screen headerText="Расписание">
      <WeekNavigation
        firstWeek={data.firstWeek}
        lastWeek={data.lastWeek}
        currentWeek={data.currentWeek}
        onWeekChange={(week) => changeWeek(week)}
      />

      <View style={GLOBAL_STYLES.daysView}>
        {data.days.map((day) =>
          day.lessons.length === 0 ? (
            <EmptyDay key={uuid4()} data={day} />
          ) : (
            <Day key={uuid4()} data={day} />
          )
        )}
      </View>
    </Screen>
  );
};

export default TimeTablePage;
