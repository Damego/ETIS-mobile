import React from "react";
import { View, Text } from "react-native";

const Subject = ({ data }) => {
  return (
    <View>
      {data.info.map((info, index) => {
        let theme = `КТ ${index + 1}`;

        return (
          <Text key={info.theme}>{`${theme}: ${
            !isNaN(info.mark) ? info.mark : 0
          }/${info.passScore}/${info.maxScore}`}</Text>
        );
      })}
    </View>
  );
};

export default Subject;
