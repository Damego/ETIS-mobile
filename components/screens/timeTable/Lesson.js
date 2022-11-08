import React, { Component } from "react";
import { View, Text } from "react-native";

import { GLOBAL_STYLES } from "../../../utils/styles";

export default class Lesson extends Component {
  constructor(props) {
    super(props);

    this.lesson = this.props.data;
  }

  render() {
    return (
      <View style={GLOBAL_STYLES.lessonContainer}>
        <View style={GLOBAL_STYLES.lessonTimeView}>
          <Text style={GLOBAL_STYLES.lessonTimeText}>
            {this.lesson.lesson + "\n" + this.lesson.time}
          </Text>
        </View>
        <View style={GLOBAL_STYLES.lessonInfoView}>
          <Text style={GLOBAL_STYLES.lessonInfoText}>
            {this.lesson.subject}
          </Text>
          <Text style={GLOBAL_STYLES.lessonInfoText}>
            {this.lesson.audience}
          </Text>
        </View>
        <View style={GLOBAL_STYLES.lessonTeacherView}>
          <Text style={GLOBAL_STYLES.lessonTeacherText}>{"Teacher 1"}</Text>
        </View>
      </View>
    );
  }
}
