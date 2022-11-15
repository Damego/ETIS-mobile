import React, { Component } from "react";
import { View, Text } from "react-native";

import Lesson from "./Lesson";
import { GLOBAL_STYLES } from "../../../utils/styles";

export default class Day extends Component {
  constructor(props) {
    super(props);

    this.date = this.props.data.date;
    this.lessons = this.props.data.lessons;
  }
  render() {
    return (
      <View>
        <View style={GLOBAL_STYLES.timeTableDateView}>
          <Text style={GLOBAL_STYLES.timeTableDateText}>{this.date}</Text>
        </View>
        <View style={GLOBAL_STYLES.timeTableDayView}>
          {this.lessons.map((lesson) => {
            return (
              <Lesson
                key={this.date + lesson.time + lesson.subject}
                data={lesson}
              />
            );
          })}
        </View>
      </View>
    );
  }
}
