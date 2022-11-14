"use strict";

import React, { Component } from "react";
import { SafeAreaView, ScrollView } from "react-native";

import Header from "../../Header";
import LoadingText from "../../LoadingText";
import Day from "./Day";
import WeekNavigation from "./WeekNagivator";

export default class TimeTablePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
    };

    // TODO: Make special class to control it?
    this.httpClient = this.props.route.params.httpClient;
    this.storage = this.props.route.params.storage;
    this.parser = this.props.route.params.parser;

    this.daysList = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
  }

  async componentDidMount() {
    // Эти данные будут заполнены с парсера
    let html = await this.httpClient.getTimeTable();
    this.data = await this.parser.parseTimeTable(html);

    this.setState({ isLoaded: true });
  }

  render() {
    if (!this.state.isLoaded) return <LoadingText />;

    return (
      <SafeAreaView>
        <Header text={"Расписание"} />
        <WeekNavigation lastWeek={this.data.lastWeek} currentWeek={this.data.currentWeek} />
        <ScrollView>
          {this.data.days.map((day) => {
            return <Day key={day.date} data={day} />;
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
