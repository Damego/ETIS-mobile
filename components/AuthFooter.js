import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

export default class AuthFooter extends Component {
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>
          {
            "Приложение ЕТИС-mobile является неоффициальным мобильным приложением для ЕТИС"
          }
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "column",
  },
  text: {
    flexGrow: 1,
    fontSize: 10,
    textAlign: "center",
  },
});
