"use strict";

import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";

import { GLOBAL_STYLES } from "../../styles/styles";
import { calculateLimits } from "../../utils/funcs";

const WeekNagivation = (props) => {
  const [buttons, changeButtons] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [firstCurrentLastWeek, setLastCurrentLastWeek] = useState([
    props.firstWeek,
    props.currentWeek,
    props.lastWeek,
  ]);

  const onArrowClick = (direction) => {
    let to_add = 0;
    if (direction == 1) to_add = 7;
    else to_add = -7;

    setLastCurrentLastWeek([
      firstCurrentLastWeek[0],
      buttons[3] + to_add, // central button,
      firstCurrentLastWeek[2],
    ]);

    setLoaded(false);
  };

  const renderNavigation = () => {
    let { leftLimit, rightLimit } = calculateLimits(...firstCurrentLastWeek);
    let _buttons = [];

    for (let i = leftLimit; i < rightLimit + 1; i++) {
      _buttons.push(i);
    }
    changeButtons(_buttons);
  };

  useEffect(() => {
    if (isLoaded) return;
    renderNavigation();
    setLoaded(true);
  });

  return (
    <View style={GLOBAL_STYLES.weekNavigationView}>
      <TouchableOpacity onPress={() => onArrowClick(0)}>
        <Image
        style={styles.arrow}
        source={require("../../assets/arrow_week_nav.png")}
        />
      </TouchableOpacity>

      {
        // TODO: yeet this shit too lol
        buttons.map((i) => {
          return props.currentWeek != i ? (
            <TouchableOpacity
              key={i}
              onPress={async () => await props.onWeekChange(i)}
            >
              <View key={i} style={GLOBAL_STYLES.weekButtonView}>
                <Text style={GLOBAL_STYLES.weekButtonText}>{i}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View key={i} style={GLOBAL_STYLES.currentWeekButtonView}>
              <Text style={GLOBAL_STYLES.currentWeekButtonText}>{i}</Text>
            </View>
          );
        })
      }

      <TouchableOpacity onPress={() => onArrowClick(1)}>
        <Image
        style={styles.arrowMirror}
        source={require("../../assets/arrow_week_nav.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default WeekNagivation;


const styles = StyleSheet.create({
  arrow: {
    width: 25,
    height: 25
  },
  arrowMirror: {
    width: 25,
    height: 25,
    transform: [{rotateY: '180deg'}]
  }
})