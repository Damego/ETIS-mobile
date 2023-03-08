import React from "react";
import { ScrollView, View } from "react-native";

import { GLOBAL_STYLES } from "../styles/styles";
import Header from "./Header";

const Screen = ({headerText, children}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} overScrollMode={"never"}>
      <View style={GLOBAL_STYLES.screen}>
        <Header text={headerText} />
        {children}
      </View>
    </ScrollView>
  );
};

export default Screen;
