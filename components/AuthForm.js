import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import AuthButton from "./AuthButton";

class Form extends Component {
  states = {
    login: "",
    password: "",
  };

  render() {
    return (
      <View style={styles.view}>
        <TextInput
          style={styles.input}
          onChangeText={(login) => {
            this.login = login;
          }}
          placeholder="Логин"
        />
        <TextInput
          style={styles.input}
          onChangeText={(password) => {
            this.password = password;
          }}
          placeholder="Пароль"
          secureTextEntry={true}
        />

        <AuthButton
          onPress={() => {
            this.props.onSubmit(this.login, this.password);
          }}
        />
      </View>
    );
  }
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
