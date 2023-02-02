import React, { Component } from "react";
import { View, Text } from "react-native";

import { GLOBAL_STYLES } from "../styles/styles";

export default class LoadingText extends Component {
  render() {
    return (
      <View style={GLOBAL_STYLES.loadingDataView}>
        <Text style={GLOBAL_STYLES.loadingDataText}>
          {"Загрузка данных..."}
        </Text>
      </View>
    );
  }
}
