"use strict";

import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default class WeekNavigation extends Component {
  constructor(props) {
    super(props);

    this.httpClient = this.props.httpClient;
    this.storage = this.props.storage;
    this.parser = this.props.parser;

    this.lastWeek = props.lastWeek;
    this.currentWeek = props.currentWeek;

    let leftLimit = this.currentWeek - 3;
    let rightLimit = this.currentWeek + 3;

    if (leftLimit < 1) {
      rightLimit += this.currentWeek - leftLimit;
      leftLimit = 1;
    }
    if (rightLimit > this.lastWeek) {
      leftLimit -= rightLimit - this.lastWeek;
      rightLimit = this.lastWeek;
    }

    this.leftLimit = leftLimit
    this.rightLimit = rightLimit
  }

  render() {
    return (
      <View>
        <TouchableOpacity>
          <Text>{"<"}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>{">"}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
