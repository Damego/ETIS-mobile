"use strict";

import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { GLOBAL_STYLES } from "../../styles/styles";

import Header from "../../components/Header";
import LoadingText from "../../components/LoadingText";
import Day from "./Day";
import EmptyDay from "./EmptyDay";
import WeekNavigation from "./WeekNagivator";

import { vars } from "../../utils/vars";

const TimeTablePage = () => {
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isLoaded) return;
    console.log("TIMETABLE IS LOADED:", isLoaded);
    const wrapper = async () => {
      let res = await getWeekData();
      console.log("Got response data:", res);
      if (res != null) {
        setLoaded(true);
        setData(res);
      }
    };
    wrapper();
  });

  /**
   * 
   * @param {number} week День недели
   */
  const getWeekData = async (week = null) => {
    // TODO: cache data

    let html;
    if (week != null) {
      html = await vars.httpClient.getTimeTable({ week: week });
    } else {
      html = await vars.httpClient.getTimeTable();
    }

    if (!html) return null;
    return vars.parser.parseTimeTable(html);
  };

  const changeWeek = async (week) => {
    let res = await getWeekData(week);
    setData(res);
  };

  if (!isLoaded || !data) return <LoadingText />;

  return (
    <View style={GLOBAL_STYLES.screen}>
      <Header text={"Расписание"} />
      <WeekNavigation
        firstWeek={data.firstWeek}
        lastWeek={data.lastWeek}
        currentWeek={data.currentWeek}
        onWeekChange={async (week) => (await changeWeek(week))}
      />
      <ScrollView>
        <View>
          {data.days.map((day) => {
            if (day.lessons.lenght == 0)
              return <EmptyDay key={day.date} date={day.date} />;
            return <Day key={day.date} data={day} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TimeTablePage;
