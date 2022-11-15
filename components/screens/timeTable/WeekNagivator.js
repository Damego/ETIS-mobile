"use strict";

import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { GLOBAL_STYLES } from "../../../utils/styles";

export default class WeekNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: []
    }

    this.httpClient = this.props.httpClient;
    this.storage = this.props.storage;
    this.parser = this.props.parser;

    this.lastWeek = props.lastWeek;
    this.currentWeek = 14; // TODO: doesn't work props.currentWeek;
  }

  componentDidMount() {
    const limits = 3;
    let leftLimit = this.currentWeek - limits;
    let rightLimit = this.currentWeek + limits;

    if (leftLimit < 1) {
      rightLimit += this.currentWeek - leftLimit;
      leftLimit = 1;
    }
    if (rightLimit > this.lastWeek) {
      leftLimit -= rightLimit - this.lastWeek;
      rightLimit = this.lastWeek;
    }

    this.leftLimit = leftLimit;
    this.rightLimit = rightLimit;

    // TODO: yeet this shit
    let buttons = [];
    for (let i = this.leftLimit; i < this.rightLimit + 1; i++) {
      buttons.push(i);
    }
    this.setState({ buttons: buttons })
  }

  onClickTest(el) {
    console.log(el);
  }

  render() {
    return (
      <View style={GLOBAL_STYLES.weekNavigationView}>

        <TouchableOpacity>
          <View style={GLOBAL_STYLES.navigaionArrowView}>
            <Text style={GLOBAL_STYLES.navigaionArrowText}>{"<"}</Text>
          </View>
        </TouchableOpacity>

        {
          // TODO: yeet this shit too lol
          this.state.buttons.map((i) => (
            <TouchableOpacity key={i} onPress={() => this.onClickTest(i)}>
              <View key={i} style={(this.currentWeek != i) ? GLOBAL_STYLES.weekButtonView : [GLOBAL_STYLES.weekButtonView, GLOBAL_STYLES.currentWeekButtonView]}>
                <Text style={(this.currentWeek != i) ? GLOBAL_STYLES.weekButtonText : [GLOBAL_STYLES.weekButtonText, GLOBAL_STYLES.currentWeekButtonText]}>{i}</Text>
              </View>
            </TouchableOpacity>
          ))
        }
        <TouchableOpacity>
          <View style={GLOBAL_STYLES.navigaionArrowView}>
            <Text style={GLOBAL_STYLES.navigaionArrowText}>{">"}</Text>
          </View>

        </TouchableOpacity>
      </View>
    );
  }
}
