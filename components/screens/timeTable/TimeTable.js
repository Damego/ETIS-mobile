"use strict";

import React, { Component, Image } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GLOBAL_STYLES } from "../../../utils/styles";

import Header from "../../Header";
import LoadingText from "../../LoadingText";
import Day from "./Day";
import EmptyDay from "./EmptyDay";
import WeekNavigation from "./WeekNagivator";

export default class TimeTablePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data: null
    };

    // TODO: Make special class to control it?
    this.httpClient = this.props.route.params.httpClient;
    this.storage = this.props.route.params.storage;
    this.parser = this.props.route.params.parser;

    this.changeLimits = true;
  }

  async getWeekData(week = null) {
    let html;
    if (!!week) {
      html = await this.httpClient.getTimeTable({week: week});
    } else {
      html = await this.httpClient.getTimeTable();
    }

    this.data = await this.parser.parseTimeTable(html);
  }

  async componentDidMount() {
    await this.getWeekData()

    this.setState({ isLoaded: true });
  }

  async changeWeek(week) {
    this.setState({ isLoaded: false });
    await this.getWeekData(week);
    this.changeLimits = false;

    // TODO: Find more better way to re-render components
    this.forceUpdate();
    this.setState({ isLoaded: true });
  }

  async onWeekChange(week) {
    await this.changeWeek(week);
  }

  calculateLimits() {
    if (!this.changeLimits) {
      let leftLimit = this.leftLimit;
      let rightLimit = this.rightLimit;
      return {leftLimit, rightLimit}
    };
    const limits = 3;
    let currentWeek = this.data.currentWeek;
    let lastWeek = this.data.lastWeek;

    let leftLimit = currentWeek - limits;
    let rightLimit = currentWeek + limits;

    if (leftLimit < 1) {
      rightLimit += currentWeek - leftLimit;
      leftLimit = 1;
    }
    if (rightLimit > lastWeek) {
      leftLimit -= rightLimit - lastWeek;
      rightLimit = lastWeek;
    }
    this.leftLimit = leftLimit;
    this.rightLimit = rightLimit;

    return {leftLimit, rightLimit}
  }

  render() {
    if (!this.state.isLoaded) return <LoadingText />;

    return (
      <View style={GLOBAL_STYLES.screen}>
        <Header text={"Расписание"} />
        <WeekNavigation
          lastWeek={this.data.lastWeek}
          currentWeek={this.data.currentWeek}
          onWeekChange={(week) => this.onWeekChange(week)}
          limits={this.calculateLimits()}
        />
        <ScrollView>
          <View>
          {this.data.days.map((day) => {
            if (day.lessons[0] == undefined) return <EmptyDay key={day.date} date={day.date}/>
            return <Day key={day.date} data={day} />;
          })}
          </View>
        </ScrollView>
      </View>
    );
  }
}
