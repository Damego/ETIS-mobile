import React from "react";
import { View, Image, StyleSheet } from "react-native";


const LoadingPage = () => {
    return (
      <View style={style.view}>
        <Image
        style={style.image}
        source={require("../assets/logo_red.png")}
        />
      </View>
    );
  
}

export default LoadingPage;


const style = StyleSheet.create({
  view: {
    backgroundColor: "#f8f8fa",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150
  }
})