import React from "react";
import { View, Text } from "react-native";

import Subject from "./Subject";

const Trimester = ({ data }) => {
  return (
    <View>
      {data.subjects.map((subject) => {
        return <Subject data={subject} key={subject.subject}/>;
      })}
    </View>
  );
};

export default Trimester;
