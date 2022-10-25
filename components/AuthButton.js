import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default class AuthButton extends Component {
  render() {
    return (
      <View style={styles.view}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={styles.text}>{"Войти"}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginTop: "5%",
    backgroundColor: "#C62E3E",
    width: "50%",
    height: "20%",
    marginLeft: "25%",
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 25,
    paddingTop: 5,
  },
});
