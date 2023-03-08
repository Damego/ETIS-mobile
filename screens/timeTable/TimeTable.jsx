"use strict";

import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { GLOBAL_STYLES } from "../../styles/styles";

import Header from "../../components/Header";
import LoadingPage from "../../components/LoadingPage";
import { Day, EmptyDay } from "./Day";
import WeekNavigation from "./WeekNagivator";

import { vars } from "../../utils/vars";

const TimeTablePage = ({ navigation }) => {
  const [isLoaded, setLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isLoaded) return;

    const wrapper = async () => {
      let res = await getWeekData();
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
    // TODO: What the fuck why navigation don't work?
    // if (vars.parser.isLoginPage(html)) {
    //   navigation.navigate("StackNavigator", {screen: "Authorization"});
    //   return;
    // }

    if (!html) return null;
    return vars.parser.parseTimeTable(html);
  };

  const changeWeek = async (week) => {
    let res = await getWeekData(week);
    setData(res);
  };

  if (!isLoaded || !data) return <LoadingPage />;
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={GLOBAL_STYLES.screen}>
        <Header text={"Расписание"} />
        <WeekNavigation
          firstWeek={data.firstWeek}
          lastWeek={data.lastWeek}
          currentWeek={data.currentWeek}
          onWeekChange={async (week) => await changeWeek(week)}
        />

        <View style={GLOBAL_STYLES.daysView}>
          {data.days.map((day, index) => {
            if (day.lessons.length === 0) {
              return <EmptyDay key={index} data={day} />;
            }
            return <Day key={index} data={day} />;
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default TimeTablePage;
