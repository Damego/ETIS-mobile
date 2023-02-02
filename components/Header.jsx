import React from "react";
import { View, Text, StatusBar } from "react-native";

import { GLOBAL_STYLES } from "../styles/styles";

const Header = ({ text }) => {
  return (
    <View style={GLOBAL_STYLES.headerContainer}>
      <StatusBar style="auto" />
      <Text style={GLOBAL_STYLES.headerText}>{text}</Text>
    </View>
  );
}

export default Header;