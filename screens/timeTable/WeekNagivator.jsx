"use strict";

import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import LoadingText from "../../components/LoadingText";
import { GLOBAL_STYLES } from "../../styles/styles";

const WeekNagivation = (props) => {
  const [buttons, changeButtons] = useState([]);

  if (buttons.length == 0) {
    let leftLimit = props.limits.leftLimit;
    let rightLimit = props.limits.rightLimit;

    let _buttons = [];

    for (let i = leftLimit; i < rightLimit + 1; i++) {
      _buttons.push(i);
    }
    changeButtons(_buttons);
  };

  if (buttons.length == 0) return <LoadingText />; // Can't happen. If it's then its a bug.

  return (
    <View style={GLOBAL_STYLES.weekNavigationView}>

      <TouchableOpacity>
        <View style={GLOBAL_STYLES.navigaionArrowView}>
          <Text style={GLOBAL_STYLES.navigaionArrowText}>{"<"}</Text>
        </View>
      </TouchableOpacity>

      {
        // TODO: yeet this shit too lol
        buttons.map((i) => (
          <TouchableOpacity key={i} onPress={async () => await props.onWeekChange(i)}>
            <View key={i} style={(props.currentWeek != i) ? GLOBAL_STYLES.weekButtonView : [GLOBAL_STYLES.weekButtonView, GLOBAL_STYLES.currentWeekButtonView]}>
              <Text style={(props.currentWeek != i) ? GLOBAL_STYLES.weekButtonText : [GLOBAL_STYLES.weekButtonText, GLOBAL_STYLES.currentWeekButtonText]}>{i}</Text>
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

export default WeekNagivation;