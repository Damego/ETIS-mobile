import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const AuthButton = (props) => {
  return (
    <View style={styles.view}>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.text}>{"Войти"}</Text>
      </TouchableOpacity>
    </View>
  );
};

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

export default AuthButton;
