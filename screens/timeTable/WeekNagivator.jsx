"use strict";

import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { GLOBAL_STYLES } from "../../styles/styles";

export default class WeekNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: []
    }
  }

  componentDidMount() {
    this.lastWeek = this.props.lastWeek;
    this.currentWeek = this.props.currentWeek;
    this.leftLimit = this.props.limits.leftLimit;
    this.rightLimit = this.props.limits.rightLimit;

    // TODO: yeet this shit
    let buttons = [];
    for (let i = this.leftLimit; i < this.rightLimit + 1; i++) {
      buttons.push(i);
    }
    this.setState({ buttons: buttons })
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
            <TouchableOpacity key={i} onPress={async () => await this.props.onWeekChange(i)}>
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
