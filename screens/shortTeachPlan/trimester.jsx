import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Subject from "./Subject";

const Trimester = ({ data }) => {
  let totalHours = 0;

  return (
    <View>
      {data.subjects.map((subject, index) => {
        totalHours += subject.total;
        return (
          <View key={index}>
            <Subject data={subject} key={"s" + index} />
            <View
              style={{
                borderBottomColor: "#1c1c1c",
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              key={"v" + index}
            />
          </View>
        );
      })}

      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />


      <View style={styles.totalHoursView}>
        <View>
          <Text
            style={styles.totalHoursText}
          >{`Всего часов: ${totalHours}`}</Text>
        </View>
      </View>
    </View>
  );
};

export default Trimester;

const styles = StyleSheet.create({
  totalHoursView: {
    backgroundColor: "#ffb",
    paddingBottom: "1%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",

  },
  totalHoursText: {
    fontSize: 14,
    textAlign: "right",
    alignSelf: "flex-end",
    marginLeft: "auto"
  },
});
