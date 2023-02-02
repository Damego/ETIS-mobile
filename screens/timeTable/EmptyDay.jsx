import React, { Component } from "react";
import { View, Text } from "react-native";

import { GLOBAL_STYLES } from "../../styles/styles";

export default class EmptyDay extends Component {
  constructor(props) {
    super(props);

    this.date = props.date;
  }
    render() {
      return (
        <View>
          <View style={GLOBAL_STYLES.timeTableDateView}>
          <Text style={GLOBAL_STYLES.timeTableDateText}>{this.date}</Text>
        </View>
        <View style={GLOBAL_STYLES.timeTableDayView}>
            <Text>Чил день</Text>
        </View>
        </View>
      )
    }
  }