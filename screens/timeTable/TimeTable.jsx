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
  var data = null;
  var changeLimits = false;
  var leftLimit = null;
  var rightLimit = null;

  useEffect(() => {
    const wrapper = async () => {
      data = await getWeekData();
      console.log("loaded data ", data);
      setLoaded(true);
    }
    wrapper();
  })

  const getWeekData = async (week = null) => {
    let html;
    if (week != null) {
      html = await vars.httpClient.getTimeTable({week: week});
    } else {
      html = await vars.httpClient.getTimeTable();
    }

    if (!html) return null;
    return vars.parser.parseTimeTable(html);
  }

  const changeWeek = async (week) => {
    setLoaded(false);
    await getWeekData(week);
    changeLimits = true;

    setLoaded(true);
  }

  const calculateLimits = () => {
    if (!changeLimits) {
      return {leftLimit, rightLimit}
    };

    const limits = 3;
    let currentWeek = data.currentWeek;
    let lastWeek = data.lastWeek;

    leftLimit = currentWeek - limits;
    rightLimit = currentWeek + limits;

    if (leftLimit < 1) {
      rightLimit += currentWeek - leftLimit;
      leftLimit = 1;
    }
    if (rightLimit > lastWeek) {
      leftLimit -= rightLimit - lastWeek;
      rightLimit = lastWeek;
    }

    return {leftLimit, rightLimit}
  }

  const onWeekChange = async (week) => {
    await changeWeek(week);
  }

  if (!isLoaded || !data) return <LoadingText />;
  console.log("check");
  console.log(isLoaded);
  console.log(data);
  return (
    <View style={GLOBAL_STYLES.screen}>
      <Header text={"Расписание"} />
      <WeekNavigation
        lastWeek={data.lastWeek}
        currentWeek={data.currentWeek}
        onWeekChange={(week) => onWeekChange(week)}
        limits={calculateLimits()}
      />
      <ScrollView>
        <View>
        {data.days.map((day) => {
          if (day.lessons[0] == undefined) return <EmptyDay key={day.date} date={day.date}/>
          return <Day key={day.date} data={day} />;
        })}
        </View>
      </ScrollView>
    </View>
  );

}

export default TimeTablePage;