import React, { Component } from "react";
import { View, Text } from "react-native";

import TimeTableDayLesson from "./TimeTableDayLesson";
import { GLOBAL_STYLES } from "../utils/styles";

export default class TimeTableDay extends Component {
  constructor(props) {
    super(props);

    this.date = this.props.data.date;
    this.lessons = this.props.data.lessons;
  }
  render() {
    return (
      <View style={GLOBAL_STYLES.timeTableDay}>
        <Text style={GLOBAL_STYLES.timeTableDate}>{this.date}</Text>
        {this.lessons.map((lesson) => {
          return (
            <TimeTableDayLesson
              key={this.date + lesson.time + lesson.subject}
              data={lesson}
            />
          );
        })}
      </View>
    );
  }
}
