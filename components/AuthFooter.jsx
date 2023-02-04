import React from "react";
import { StyleSheet, View, Text } from "react-native";

const AuthFooter = () => {
    return (
      <View style={styles.view}>
        <Text style={styles.text}>
          {
            "Приложение ЕТИС мобайл является неоффициальным мобильным приложением для ЕТИС"
          }
        </Text>
      </View>
    );
  
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

export default AuthFooter;