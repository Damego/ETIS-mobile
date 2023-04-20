import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create ({
  markSuccess: {
    fontSize: 16,
    fontWeight: '600',
  },
  markFail: {
    color: '#CE2539',
    fontSize: 16,
    fontWeight: '600',
  }
});

const Subject = ({ data }) => (
    <View>
      {data.info.map((info, index) => {
        const theme = `КТ ${index + 1}`;

        return (
          <Text style={(Number.isNaN(info.mark) || info.passScore <= info.mark) ? styles.markSuccess : styles.markFail} key={info.theme}>{`${theme}: ${
            !Number.isNaN(info.mark) ? info.mark : "-"
          }/${info.passScore}/${info.maxScore}`}</Text>
        );
      })}
    </View>
  );


export default Subject;
