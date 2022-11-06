"use strict";

import React, { Component } from "react";
import { SafeAreaView, FlatList, Text, ScrollView } from "react-native";

import Header from "../Header";
import LoadingText from "../LoadingText";

export default class TimeTablePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
    };

    this.httpClient = this.props.route.params.httpClient;
    this.storage = this.props.route.params.storage;

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
    this.data = [
      {
        date: "31 октября",
        lessons: [
          {
            audience: "ауд. 408/2 (407) (2 корпус, 3 этаж)",
            lesson: "1 пара",
            subject: "Введение в математический анализ (практ)",
            time: "8:00",
          },
          {
            audience: "ауд. 512/2 (510) (2 корпус, 4 этаж)",
            lesson: "2 пара",
            subject: "Введение в математический анализ (лек)",
            time: "9:45",
          },
        ],
      },
      {
        date: "1 ноября",
        lessons: [
          {
            audience: "ауд. 408/2 (407) (2 корпус, 3 этаж)",
            lesson: "1 пара",
            subject: "Введение в математический анализ (практ)",
            time: "8:00",
          },
          {
            audience: "ауд. 512/2 (510) (2 корпус, 4 этаж)",
            lesson: "2 пара",
            subject: "Введение в математический анализ (лек)",
            time: "9:45",
          },
        ],
      },
    ];

    this.setState({isLoaded: true})
  }

  render() {
    if (!this.state.isLoaded) return <LoadingText />;

    return (
      <SafeAreaView>
        <Header text={"ЕТИС | Расписание"} />
        <ScrollView>
          <Text>{this.data[0].date}</Text>
          <FlatList
            data={this.data[0].lessons}
            renderItem={({ item }) => <Text>{item.subject}</Text>}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}
