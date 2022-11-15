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
            {this.lesson.time}
          </Text>
        </View>
        <View style={GLOBAL_STYLES.lessonInfoView}>
          <Text style={GLOBAL_STYLES.lessonInfoText}>
            {this.lesson.subject}
          </Text>
          <Text style={GLOBAL_STYLES.lessonAudienceText}>
            {this.lesson.audience}
          </Text>
        </View>
      </View>
    );
  }
}
