import React from "react";
import { View, Text } from "react-native";

const Subject = ({ data }) => {
  return (
    <View>
      <Text>{data.subject}</Text>
    </View>
  );
};

export default Subject;
