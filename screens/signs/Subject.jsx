import React from "react";
import { View, Text } from "react-native";

const Subject = ({ data }) => (
    <View>
      {data.info.map((info, index) => {
        const theme = `КТ ${index + 1}`;

        return (
          <Text key={info.theme}>{`${theme}: ${
            !Number.isNaN(info.mark) ? info.mark : "-"
          }/${info.passScore}/${info.maxScore}`}</Text>
        );
      })}
    </View>
  );


export default Subject;
