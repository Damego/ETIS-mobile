import React, { Component } from "react";
import { StyleSheet, View, TextInput, Button } from "react-native";

class Form extends Component {
  states = {
    login: "",
    password: "",
  };

  render() {
    return (
      <View>
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
        />
        <Button
          title="Войти"
          onPress={() => {
            this.props.defaultAuth(this.login, this.password);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderColor: "#C62E3E",
    padding: 10,
    marginVertical: 30,
    marginHorizontal: "20%",
    width: "60%",
  },
});

export default Form;
