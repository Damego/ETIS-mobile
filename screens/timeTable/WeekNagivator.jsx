"use strict";

import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import LoadingText from "../../components/LoadingText";
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
    console.log("clicked", direction);

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
    console.log(leftLimit, rightLimit);
    let _buttons = [];

    for (let i = leftLimit; i < rightLimit + 1; i++) {
      _buttons.push(i);
    }
    console.log("generated btns", _buttons);
    changeButtons(_buttons);
  };

  useEffect(() => {
    console.log("fclw", firstCurrentLastWeek);
    if (isLoaded) return;
    renderNavigation();
    setLoaded(true);
  });

  if (buttons.length == 0) return <LoadingText />;

  return (
    <View style={GLOBAL_STYLES.weekNavigationView}>
      <TouchableOpacity onPress={() => onArrowClick(0)}>
        <View style={GLOBAL_STYLES.navigaionArrowView}>
          <Text style={GLOBAL_STYLES.navigaionArrowText}>{"<"}</Text>
        </View>
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
        <View style={GLOBAL_STYLES.navigaionArrowView}>
          <Text style={GLOBAL_STYLES.navigaionArrowText}>{">"}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default WeekNagivation;
