import React from "react";
import { View, Text } from "react-native";

import { GLOBAL_STYLES } from "../styles/styles";

const LoadingText = () => {
    return (
      <View style={GLOBAL_STYLES.loadingDataView}>
        <Text style={GLOBAL_STYLES.loadingDataText}>
          {"Загрузка данных..."}
        </Text>
      </View>
    );
  
}

export default LoadingText;