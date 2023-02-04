import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import AuthButton from "./AuthButton";

const Form = (props) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.view}>
      <TextInput
        style={styles.input}
        onChangeText={(login) => {
          setLogin(login)
        }}
        placeholder="Логин"
      />
      <TextInput
        style={styles.input}
        onChangeText={(password) => {
          setPassword(password);
        }}
        placeholder="Пароль"
        secureTextEntry={true}
      />

      <AuthButton
        onPress={() => {
          props.onSubmit(login, password);
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  view: {
    marginVertical: "50%",
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: "#C62E3E",
    padding: 10,
    marginVertical: 20,
    marginHorizontal: "10%",
    width: "80%",
  },
});

export default Form;
